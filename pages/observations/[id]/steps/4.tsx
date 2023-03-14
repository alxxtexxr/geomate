import { useRef, useState, useEffect, FormEvent, ChangeEvent, FocusEvent } from 'react';
import Head from 'next/head'
import Router from 'next/router';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import BottomSheet from '../../../../components/BottomSheet';
import { Message, FormControl, Keyboard } from '../../../../components/Observation';
import Loading from '../../../../components/Loading';

// Constants
import { KEYBOARD_LAYOUTS } from '../../../../Constants';

// Utils
import { getShape, formatFormula, checkFormula } from '../../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type { Observation, ShapeCode } from '@prisma/client';
import type { KeyboardLayoutObject } from 'react-simple-keyboard';
import type ComponentWithAuth from '../../../../types/ComponentWithAuth';
import type Shape from '../../../../types/Shape';
import type ObservationFormValues from '../../../../types/ObservationFormValues';

type Props = {
    observation: Observation,
    shape: Shape,
};

const ObservationStep4: ComponentWithAuth<Props> = ({ observation, shape }) => {
    // Define comparisonShape
    const comparisonShapeCodes: { [key: string]: ShapeCode | null } = {
        cylinder: null,
        cone: 'cylinder',
        sphere: 'cone',
    };
    const comparisonShapeCode = comparisonShapeCodes[shape.code];
    const comparisonShape = comparisonShapeCode && getShape(comparisonShapeCode);
    const comparisonShapeFormula = shape.code === 'cylinder'
        ? 'pi*r^2' // The formula of area of a circle
        : (comparisonShape && comparisonShape.vFormula)

    // Configure keyboard
    const keyboardRef = useRef(null);
    const keyboardLayouts: { [key: string]: KeyboardLayoutObject } = {
        comparisonVFormula: KEYBOARD_LAYOUTS.formula,
        n: KEYBOARD_LAYOUTS.numeric,
        vFormula: KEYBOARD_LAYOUTS.formula,
    };

    // Define correct values
    const correctNs: { [key: string]: number } = {
        cylinder: observation.t || 0,
        cone: 3,
        sphere: 4,
    };
    const correctValues = {
        comparisonVFormula: comparisonShapeFormula && formatFormula(comparisonShapeFormula),
        n: correctNs[shape.code],
        vFormula: shape.vFormula && formatFormula(shape.vFormula),
    };

    // States
    const [form, setForm] = useState<ObservationFormValues>({
        comparisonVFormula: '',
        n: '',
        vFormula: '',
    });
    const [focusedInputName, setFocusedInputName] = useState<string | null>(null);
    const [isInputCorrect, setIsInputCorrect] = useState({
        comparisonVFormula: false,
        n: false,
        vFormula: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Define n variables
    const nOps: { [key: string]: string } = {
        cylinder: '× t',
        cone: '× 1/',
        sphere: '×',
    }

    // Functions
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        await Router.push(`/observations/${observation.id}/steps/4`);
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

    const isAllInputCorrect = () => Object.values(isInputCorrect).every((v) => v);

    // Effects
    useEffect(() => {
        // Check if comparisonVFormula is correct
        if (form.comparisonVFormula && correctValues.comparisonVFormula) {
            // console.log('comparisonVFormula', form.comparisonVFormula, correctValues.comparisonVFormula)
            setIsInputCorrect({
                ...isInputCorrect,
                comparisonVFormula: checkFormula('' + form.comparisonVFormula, correctValues.comparisonVFormula),
            });
        }

        // Check if n is correct
        if (form.n) {
            // console.log('n', +form.n === correctValues.n)
            setIsInputCorrect({
                ...isInputCorrect,
                n: +form.n === correctValues.n,
            });
        }

        // Check if vFormula is correct
        if (form.vFormula && correctValues.vFormula) {
            // console.log('vFormula', form.vFormula, correctValues.vFormula)
            setIsInputCorrect({
                ...isInputCorrect,
                vFormula: checkFormula('' + form.vFormula, correctValues.vFormula),
            });
        }
    }, [form]);

    return (
        <main className="w-inherit h-screen bg-white">
            <Head>
                <title>Observasi (4/4) | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <div className="sticky top-0 z-10 rounded-b-2xl border-shadow-b overflow-hidden">
                <div className="rounded-b-2xl overflow-hidden">
                    <ShapePreview
                        height={272}
                        shapeCode={shape.code}
                        r={observation.r || 0}
                        t={observation.t || 0}
                    />
                </div>

                {/* Message */}
                <div className="flex bg-white bg-opacity-95 p-4">
                    <Message>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ante eu nulla accumsan eleifend.
                    </Message>
                </div>
            </div>

            <BottomSheet className="w-inherit">
                {/* Form */}
                <form className="w-inherit pt-4 px-4 pb-space-for-keyboard" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Inputs */}
                        <div className="grid grid-cols-1 gap-2">
                            {/* comparisonVFormula Input */}
                            {shape.code === 'cylinder' ? (
                                <div className="grid grid-cols-3">
                                    <span className="label-text flex items-self-center items-center text-xs text-gray-800">
                                        <div className="badge badge-primary badge-outline text-xs h-7 w-7 mr-2">
                                            v
                                        </div>
                                        V. {shape.name}
                                    </span>
                                    <div className="col-span-2">
                                        <div className="flex items-center font-mono text-base">
                                            <input
                                                className={`input input-bordered flex-grow w-16 mx-0.5 ${isInputCorrect.comparisonVFormula ? 'input-primary' : 'input-error'}`}
                                                name="comparisonVFormula"
                                                placeholder="Rumus L. Lingkaran"
                                                value={form.comparisonVFormula}
                                                onChange={handleChange}
                                                onFocus={handleFocus}
                                            />
                                            {(nOps[shape.code]).split('').map((c, i) => (
                                                <div className="mx-0.5" key={i}>
                                                    {c}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <FormControl
                                        title={`V. ${shape.name}`}
                                        symbol="v"
                                        isCorrect={isInputCorrect.comparisonVFormula}
                                        name="comparisonVFormula"
                                        placeholder={comparisonShape ? `Rumus V. ${comparisonShape.name}` : ''}
                                        value={form.comparisonVFormula}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                    />

                                    {isInputCorrect.comparisonVFormula && shape.code === 'sphere' && (
                                        <>
                                            <FormControl
                                                name="correctedFormula"
                                                placeholder={comparisonShape ? `Rumus V. ${comparisonShape.name}` : ''}
                                                value="1/3×π×r²×(r)"
                                                disabled
                                            />
                                            <FormControl
                                                name="correctedFormula"
                                                placeholder={comparisonShape ? `Rumus V. ${comparisonShape.name}` : ''}
                                                value="1/3×π×r³"
                                                disabled
                                            />
                                        </>
                                    )}

                                    {/* n input */}
                                    <div className="grid grid-cols-3">
                                        <div className="col-start-2 col-span-2">
                                            <div className="flex items-center font-mono text-base">
                                                {nOps[shape.code].split('').map((c, i) => (
                                                    <div className="mx-0.5" key={i}>
                                                        {c}
                                                    </div>
                                                ))}
                                                <input
                                                    className={`input input-bordered flex-grow w-16 mx-0.5 ${isInputCorrect.n ? 'input-primary' : 'input-error'}`}
                                                    name="n"
                                                    placeholder="?"
                                                    value={form.n}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* vFormula Input */}
                            <FormControl
                                name="vFormula"
                                isCorrect={isInputCorrect.vFormula}
                                placeholder={`Rumus V. ${shape.name}`}
                                value={form.vFormula}
                                onChange={handleChange}
                                onFocus={handleFocus}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-95 w-inherit p-4 rounded-t-2xl">
                        {isSubmitting ? (<Loading.Button />) : (
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={!isAllInputCorrect()}
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
                    layout={keyboardLayouts[focusedInputName]}
                    form={form}
                    focusedInputName={focusedInputName}
                    setFocusedInputName={setFocusedInputName}
                    onChange={handleKeyboardChange}
                />
            )}
        </main >
    );
};

ObservationStep4.auth = true;

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

export default ObservationStep4;