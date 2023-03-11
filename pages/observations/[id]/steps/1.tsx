import { useRef, useState, useEffect, FormEvent, ChangeEvent, FocusEvent } from 'react';
import Head from 'next/head'
import Router from 'next/router';
import { Parser } from 'expr-eval';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import BottomSheet from '../../../../components/BottomSheet';
import MessageBalloon from '../../../../components/MessageBalloon';
import { FormControl, Keyboard } from '../../../../components/Observation';
import Loading from '../../../../components/Loading';

// Constants
import { KEYBOARD_LAYOUTS } from '../../../../Constants';

// Utils
import { getShape, getMathSymbol, extractMathSymbolCodes, roundToNearest } from '../../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type { Observation } from '@prisma/client';
import type ComponentWithAuth from '../../../../types/ComponentWithAuth';
import type Shape from '../../../../types/Shape';
import ObservationFormValues from '../../../../types/ObservationFormValues';

type Props = {
    observation: Observation,
    shape: Shape,
};

const ObservationStep1: ComponentWithAuth<Props> = ({ observation, shape }) => {
    const vMathSymbolCodes = extractMathSymbolCodes(shape.vFormula);
    const keyboardRef = useRef(null);

    // States
    const [form, setForm] = useState<ObservationFormValues>({
        r: '' + getMathSymbol('r').defaultValue,
        t: '' + getMathSymbol('t').defaultValue,
        v: '',
    });
    const [focusedInputName, setFocusedInputName] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const newV = '' + roundToNearest(Parser.evaluate(shape.vFormula, {
            ...form,
            pi: 3.14,
        }), 0.05);

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

            <div className="sticky top-0 z-10 rounded-b-2xl border-shadow-b overflow-hidden">
                <div className="rounded-b-2xl shadow overflow-hidden">
                    <ShapePreview
                        shapeCode={shape.code}
                        r={+form.r || 0}
                        t={+form.t || 0}
                    />
                </div>

                {/* Message */}
                <div className="flex bg-white bg-opacity-90 p-4">
                    <div className="avatar">
                        <div className="w-20 rounded-full">
                            <img src="https://faces-img.xcdn.link/image-lorem-face-891.jpg" />
                        </div>
                    </div>
                    <MessageBalloon>
                        That sounds like a great idea. I was actually planning on going for a run on Saturday morning.
                    </MessageBalloon>
                </div>
            </div>

            <BottomSheet className="w-inherit">
                {/* Form */}
                <form className="w-inherit p-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Inputs */}
                        <div className="grid grid-cols-1 gap-2">
                            {vMathSymbolCodes.map((mathSymbolCode) => (
                                <FormControl
                                    key={mathSymbolCode}
                                    title={getMathSymbol(mathSymbolCode).title}
                                    symbol={mathSymbolCode}
                                    suffix="cm"
                                    canMeasure
                                    name={mathSymbolCode}
                                    value={(form as ObservationFormValues)[mathSymbolCode]}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                />
                            ))}
                            <hr />
                            <FormControl
                                title="Volume"
                                symbol="v"
                                suffix="cm²"
                                value={form.v}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 w-inherit p-4 rounded-t-2xl">
                        {isSubmitting ? (<Loading.Button />) : (
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={!isFormFilled()}
                            >
                                Selanjutnya
                            </button>
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