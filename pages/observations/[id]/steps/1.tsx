import { useRef, useState, useEffect, FormEvent, ChangeEvent, FocusEvent } from 'react';
import Head from 'next/head'
import Router from 'next/router';
import { Parser } from 'expr-eval';
import { MdOutlineSwitchCamera } from 'react-icons/md';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import BottomSheet from '../../../../components/BottomSheet';
import { Message, FormControl, Keyboard, Note } from '../../../../components/Observation';
import Loading from '../../../../components/Loading';

// Constants
import { KEYBOARD_LAYOUTS } from '../../../../Constants';

// Utils
import { getShape, getMathSymbol, extractMathSymbolCodes, floorToNearest, getPi } from '../../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type { Observation } from '@prisma/client';
import type ComponentWithAuth from '../../../../types/ComponentWithAuth';
import type Shape from '../../../../types/Shape';
import type ObservationFormValues from '../../../../types/ObservationFormValues';

type Props = {
    observation: Observation,
    shape: Shape,
};

const ObservationStep1: ComponentWithAuth<Props> = ({ observation, shape }) => {
    const vMathSymbolCodes = extractMathSymbolCodes(shape.vFormula);
    const keyboardRef = useRef(null);

    // States
    const [form, setForm] = useState<ObservationFormValues>({
        r: '',
        t: '',
        v: '',
    });
    const [focusedInputName, setFocusedInputName] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [highlight, setHighlight] = useState<string>();

    // Functions
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch(`/api/observations/${observation.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    r: +(form.r || 0),
                    t: +(form.t || 0),
                    v: +(form.v || 0),
                }),
            });

            await Router.push(`/observations/${observation.id}/steps/2`);
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
        }
    };

    const updateForm = (name: string, value: string) => {
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        updateForm(name, value);

        if (keyboardRef.current) {
            (keyboardRef.current as any).setInput(value);
        }
    };

    const handleKeyboardChange = (input: string) => {
        if (focusedInputName) {
            updateForm(focusedInputName, input);
        }
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        const { name } = e.target

        setFocusedInputName(name);

        if (keyboardRef.current) {
            (keyboardRef.current as any).setInput((form as ObservationFormValues)[name]);
        }
    };

    const isFormFilled = () =>
        vMathSymbolCodes.every((mathSymbolCode) => +(form as ObservationFormValues)[mathSymbolCode] > 0);

    // Effects
    useEffect(() => {
        // Calculate the volume
        const previousV = form.v;
        const newV = floorToNearest(Parser.evaluate(shape.vFormula, {
            ...form,
            pi: getPi(+form.r),
        }), 0.1).toFixed(1);

        if (newV !== previousV) {
            setForm({
                ...form,
                v: newV
            });
        }
    }, [form]);

    return (
        <main className="w-inherit h-screen bg-white">
            <Head>
                <title>Observasi (1/4) | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <div className="sticky top-0 z-10 bg-black rounded-b-2xl overflow-hidden">
                <ShapePreview
                    shapeCode={shape.code}
                    r={+form.r || 1}
                    t={+form.t || 1}
                    highlight={highlight}
                />
            </div>

            <BottomSheet className="w-inherit">
                {/* Form */}
                <form className="w-inherit p-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <Message messages={['Sebelumnya, ukurlah objek yang kamu amati kemudian catatlah hasil pengukuranmu!']} />

                        <Note>
                            <>Klik ikon <MdOutlineSwitchCamera className="inline-flex text-primary text-lg mx-0.5" /> untuk mengukur menggunakan kamera</>
                        </Note>

                        {/* Inputs */}
                        <div className="grid grid-cols-1 gap-2">
                            {vMathSymbolCodes.map((mathSymbolCode) => (
                                <FormControl
                                    key={mathSymbolCode}
                                    label={getMathSymbol(mathSymbolCode).title}
                                    symbol={mathSymbolCode}
                                    suffix="cm"
                                    canMeasure
                                    name={mathSymbolCode}
                                    placeholder="?"
                                    value={(form as ObservationFormValues)[mathSymbolCode]}
                                    onChange={handleChange}
                                    onFocus={(e) => {
                                        handleFocus(e);
                                        if (e.target.name) {
                                            setHighlight(e.target.name);
                                        }
                                    }}
                                // onBlur
                                />
                            ))}
                            <div className="grid grid-cols-1 gap-4">
                                <hr className="border-gray-300" />
                                <Note>
                                    Berdasarkan hasil pengukuranmu, diperoleh:
                                </Note>
                                <FormControl
                                    label={`Volume ${shape.name}`}
                                    symbol="V"
                                    suffix="cm²"
                                    value={form.v}
                                    disabled
                                />
                            </div>
                        </div>
                        {isFormFilled() && (
                            <Message
                                messages={[
                                    `Dari volume ${shape.name.toLowerCase()} yang diperoleh, yuk kita temukan bagaimana cara menghitung volume tersebut!`,
                                ]}
                                button={isSubmitting ? (<Loading.Button />) : (
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        disabled={!isFormFilled()}
                                    >
                                        Selanjutnya
                                    </button>
                                )} />
                        )}
                    </div>
                </form>
            </BottomSheet>

            {focusedInputName && (
                <Keyboard
                    keyboardRef={keyboardRef}
                    layout={KEYBOARD_LAYOUTS.numeric}
                    form={form}
                    focusedInputName={focusedInputName}
                    setFocusedInputName={setFocusedInputName}
                    onChange={handleKeyboardChange}
                    onHide={() => setHighlight(undefined)}
                />
            )}
        </main >
    );
};

ObservationStep1.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers;
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/observations/${id}`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const observation = await res.json();
    const shape = getShape(observation.shapeCode);

    return { props: { observation, shape } };
};

export default ObservationStep1;