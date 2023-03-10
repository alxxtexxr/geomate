import { useRef, useState, useEffect, FormEvent, ChangeEvent, FocusEvent } from 'react';
import Head from 'next/head'
import Router from 'next/router';
import { Parser } from 'expr-eval';
import Keyboard, { KeyboardLayoutObject } from 'react-simple-keyboard';

import 'react-simple-keyboard/build/css/index.css';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import BottomSheet from '../../../../components/BottomSheet';
import MessageBalloon from '../../../../components/MessageBalloon';
import ObservationInput from '../../../../components/ObservationInput';
import LoaderButton from '../../../../components/LoaderButton';

// Utils
import { getShape, inputValueToNumber, formatFormula } from '../../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../../types/ComponentWithAuth';
import type Shape from '../../../../types/Shape';
import type { Observation, ShapeCode } from '@prisma/client';

type Props = {
    observation: Observation,
    shape: Shape,
};

type FormValues = { [key: string]: string | number | null };

const ObservationStep2: ComponentWithAuth<Props> = ({ observation, shape }) => {
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

    // Define correct values
    const correctValues = {
        formula: comparisonShapeFormula && formatFormula(comparisonShapeFormula),
        r: observation.r,
        t: observation.t,
        v: comparisonShapeFormula && +Parser.evaluate(comparisonShapeFormula, {
            pi: 3.14,
            r: observation.r || 0,
            t: shape.code === 'sphere' ? observation.r || 0 : observation.t || 0,
        }).toFixed(1),
    };

    // Configure keyboard
    const keyboardRef = useRef(null);
    const formulaKeyboardLayouts: { [key: string]: KeyboardLayoutObject } = {
        cylinder: {
            default: [
                '+ - ÷ × ² {bksp}',
                'π r',
            ],
        },
        cone: {
            default: [
                '+ - ÷ × ² {bksp}',
                'π r t',
            ],
        },
        sphere: {
            default: [
                '+ - ÷ × ² {bksp}',
                '1/3 π r t',
            ],
        },
    };
    const numericKeyboardLayout = {
        default: [
            '1 2 3 4 5 {bksp}',
            '6 7 8 9 0 .',
        ],
    };
    const keyboardLayouts: { [key: string]: KeyboardLayoutObject } = {
        formula: formulaKeyboardLayouts[shape.code],
        r: numericKeyboardLayout,
        t: numericKeyboardLayout,
        v: numericKeyboardLayout,
    };

    // States
    const [form, setForm] = useState({
        formula: '',
        r: '',
        t: '',
        v: '',
    });
    const [focusedInputName, setFocusedInputName] = useState<string | null>(null);
    const [isInputCorrect, setIsInputCorrect] = useState({
        formula: false,
        r: false,
        t: false,
        v: false,
    });
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
                    comparisonV: +form.v,
                }),
            });

            await Router.push(`/observations/${observation.id}/steps/3`);
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        let updatedValue = name === 'formula' ? value : inputValueToNumber(value);

        setForm({
            ...form,
            [name]: updatedValue,
        });

        if (keyboardRef.current) {
            (keyboardRef.current as any).setInput(value);
        }
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        const { name } = e.target

        setFocusedInputName(name);

        if (keyboardRef.current) {
            (keyboardRef.current as any).setInput((form as FormValues)[name]);
        }
    };

    const checkFormula = (formula: string, correctFormula: string) => {
        const formulaArr = formula.replaceAll(' ', '').split('×').sort();
        const correctFormulaArr = correctFormula.replaceAll(' ', '').split('×').sort();

        if (formulaArr.length !== correctFormulaArr.length) {
            return false;
        }

        return formulaArr.every((mathSymbol, i) => mathSymbol === correctFormulaArr[i]);
    };

    const isAllInputCorrect = () => {
        let filteredFormula = `v = ${comparisonShapeFormula}`;
        filteredFormula = filteredFormula?.replaceAll('pi', '')
        if (shape.code === 'sphere') { filteredFormula = filteredFormula?.replaceAll('t', '') }

        const abcMathSymbols = filteredFormula?.match(/[a-zA-Z]+/g);

        const filteredIsInputCorrect = Object.fromEntries(
            Object.entries(isInputCorrect).filter(([key]) => abcMathSymbols?.includes(key))
        );

        return Object.values(filteredIsInputCorrect).every((v) => v);
    };

    // Effects
    useEffect(() => {
        // Check if formula is correct
        if (form.formula && correctValues.formula) {
            // console.log('formula', form.formula, correctValues.formula)
            setIsInputCorrect({
                ...isInputCorrect,
                formula: checkFormula(form.formula, correctValues.formula),
            });
        }

        // Check if r (radius) is correct
        if (form.r) {
            // console.log('r', form.r, correctValues.r)
            setIsInputCorrect({
                ...isInputCorrect,
                r: +form.r === observation.r,
            });
        }

        // Check if t (tinggi/height) is correct
        if (form.t) {
            // console.log('t', form.t, correctValues.t)
            setIsInputCorrect({
                ...isInputCorrect,
                t: +form.t === observation.t,
            });
        }

        // Check if v (volume) is correct
        if (form.v) {
            // console.log('v', form.v, correctValues.v)
            setIsInputCorrect({
                ...isInputCorrect,
                v: +form.v === correctValues.v,
            });
        }
    }, [form]);

    return (
        <main className="w-inherit h-screen bg-black">
            <Head>
                <title>Observasi (2/4) | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            {comparisonShapeCode && (
                <ShapePreview
                    height={136}
                    shapeCode={shape.code}
                    r={observation.r || 0}
                    t={observation.t || 0}
                />
            )}

            <ShapePreview
                // Kek, this one is horrifying
                // It will multiply 136 by 2 if 'comparisonShapeCode' is null
                // Else it will multiply 136 by 1
                height={136 * -(+!!comparisonShapeCode - 2)}
                shapeCode={comparisonShapeCode || shape.code}
                r={+form.r || 0}
                t={shape.code === 'sphere' ? +form.r : +form.t || 0}
            />

            <BottomSheet className="w-inherit">
                {/* Form */}
                <form className="w-inherit p-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Message */}
                        <div className="flex">
                            <div className="avatar">
                                <div className="w-20 rounded-full">
                                    <img src="https://faces-img.xcdn.link/image-lorem-face-891.jpg" />
                                </div>
                            </div>
                            <MessageBalloon>
                                That sounds like a great idea. I was actually planning on going for a run on Saturday morning.
                            </MessageBalloon>
                        </div>

                        {/* Inputs */}
                        <div className="grid grid-cols-1 gap-2">
                            {/* formula Input */}
                            <ObservationInput
                                title={shape.code === 'cylinder' ? 'L. Lingkaran' : (comparisonShape ? `V. ${comparisonShape.name}` : 'Volume')}
                                symbol="v"
                                isCorrect={isInputCorrect.formula}
                                name="formula"
                                value={form.formula}
                                onChange={handleChange}
                                onFocus={handleFocus}
                            />

                            {isInputCorrect.formula && (
                                <div className="grid grid-cols-3">
                                    <div className="col-start-2 col-span-2">
                                        <div className="flex items-center font-mono text-base">
                                            {comparisonShapeFormula && comparisonShapeFormula
                                                .replaceAll(' ', '')
                                                .replaceAll('*', ' * ')
                                                .replaceAll('^', ' ^').split(' ')
                                                .map((mathSymbol, i) => {
                                                    const formattedMathSymbol = formatFormula(mathSymbol);
                                                    if (/[a-zA-Z]/.test(formattedMathSymbol)) {
                                                        const name = shape.code === 'sphere' && formattedMathSymbol === 't' ? 'r' : formattedMathSymbol;

                                                        const isCorrect = (isInputCorrect as { [key: string]: boolean })[name]
                                                        const isCorrectCx = isCorrect ? 'input-primary' : 'input-error';


                                                        return (
                                                            <input
                                                                key={i}
                                                                className={`input input-bordered flex-grow w-16 mx-0.5 ${isCorrectCx}`}
                                                                placeholder={formattedMathSymbol}
                                                                name={name}
                                                                value={(form as FormValues)[name] || ''}
                                                                onChange={handleChange}
                                                                onFocus={handleFocus}
                                                            />
                                                        );
                                                    } else {
                                                        return (
                                                            <div
                                                                key={i}
                                                                className="mx-0.5"
                                                            >
                                                                {formattedMathSymbol}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* formulaResult Input */}
                            <ObservationInput
                                suffix="cm"
                                name="v"
                                isCorrect={isInputCorrect.v}
                                value={form.v || ''}
                                onChange={handleChange}
                                onFocus={handleFocus}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-inherit p-4">
                        {isSubmitting ? (<LoaderButton />) : (
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
                <div
                    className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-inherit rounded-t-2xl"
                    style={{ backgroundColor: '#ececec' }}
                >
                    <Keyboard
                        keyboardRef={(r) => (keyboardRef.current = r)}
                        layout={keyboardLayouts[focusedInputName]}
                        display={{
                            '{bksp}': 'Hapus ⌫',
                            '{space}': 'Spasi',
                        }}
                        buttonTheme={[
                            {
                                class: 'w-5-important',
                                buttons: '{bksp} .'
                            },
                        ]}
                        onChange={(input) => setForm({
                            ...form,
                            [focusedInputName]: input,
                        })}
                    />
                    <div className="px-2 pb-2">
                        <button
                            className="btn btn-primary btn-block shadow"
                            type="button"
                            onClick={() => setFocusedInputName(null)}
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            )}
        </main >
    );
};

ObservationStep2.auth = true;

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

export default ObservationStep2;