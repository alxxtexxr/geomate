import { useRef, useState, FormEvent, ChangeEvent, FocusEvent, useEffect } from 'react';
import Head from 'next/head'
import Router from 'next/router';
import { Parser } from 'expr-eval';
import katex from 'katex';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import BottomSheet from '../../../../components/BottomSheet';
import { Message, FormControl, Input, InputOp, Keyboard } from '../../../../components/Observation';
import Loading from '../../../../components/Loading';
import Note from '../../../../components/Observation/ObservationNote';

// Constants
import { KEYBOARD_LAYOUTS, SHAPE_PREVIEW_DEFAULT_HEIGHT } from '../../../../Constants';

// Utils
import { getShape, formatFormula, checkFormula, roundToNearest, getPiString } from '../../../../Utils';

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

type FormValues = { [key: string]: string | number | null };

const MESSAGE_MAP: { [key: string]: string } = {
    cylinder: 'Untuk memulai menghitung volume tabung, pertama kita perlu mencari luas alas tabung',
    cone: 'Untuk menemukan rumus volume kerucut, kita dapat memanfaatkan rumus volume tabung yang sudah kamu dapatkan sebelumnya!',
};

const ObservationStep2: ComponentWithAuth<Props> = ({ observation, shape }) => {
    // Define Pi value
    const piString = getPiString(observation.r);
    const pi = Parser.evaluate(piString)

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
    const comparisonShapeFormulaToFormat = shape.code === 'sphere'
        ? '1/3*pi*r^3'
        : comparisonShapeFormula

    // Define correct values
    const correctValues = {
        baseShape: 'lingkaran',
        formula: comparisonShapeFormula && formatFormula(comparisonShapeFormula),
        r: observation.r,
        t: observation.t,
        v: comparisonShapeFormula && roundToNearest(+Parser.evaluate(comparisonShapeFormula, {
            pi: pi,
            r: observation.r || 0,
            t: shape.code === 'sphere' ? observation.r || 0 : observation.t || 0,
        }), 0.005).toFixed(2),
    };

    // Configure keyboard
    const keyboardRef = useRef(null);
    const keyboardLayouts: { [key: string]: KeyboardLayoutObject } = {
        baseShape: KEYBOARD_LAYOUTS.alphabetic,
        formula: KEYBOARD_LAYOUTS.formula,
        r: KEYBOARD_LAYOUTS.numeric,
        t: KEYBOARD_LAYOUTS.numeric,
        v: KEYBOARD_LAYOUTS.numeric,
    };

    // States
    const [form, setForm] = useState<ObservationFormValues>({
        baseShape: '',
        formula: '',
        r: '',
        t: '',
        v: '',
    });
    const [focusedInputName, setFocusedInputName] = useState<string | null>(null);
    const [isInputCorrect, setIsInputCorrect] = useState({
        baseShape: false,
        formula: false,
        r: false,
        t: false,
        v: false,
    });
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
                    comparisonV: +form.v,
                }),
            });

            await Router.push(`/observations/${observation.id}/steps/3`);
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
        }
    };

    const updateForm = (name: string, value: string) => {
        if (correctValues.formula && name === 'baseShape') {
            setIsInputCorrect({
                ...isInputCorrect,
                baseShape: value.toLowerCase() === correctValues.baseShape,
            });
        } else if (correctValues.formula && name === 'formula') {
            // Check if formula is correct
            // console.log(name, value, '=', correctValues.formula)
            setIsInputCorrect({
                ...isInputCorrect,
                formula: checkFormula(value, correctValues.formula),
            });
        } else {
            console.log(name, value, '=', (correctValues as { [key: string]: string | number })[name])
            setIsInputCorrect({
                ...isInputCorrect,
                [name]: +value === +(correctValues as { [key: string]: string | number })[name],
            });
        }

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

        setHighlight(name === 'formula' || name === 'v' ? undefined : name);
        setFocusedInputName(name);

        if (keyboardRef.current) {
            (keyboardRef.current as any).setInput((form as FormValues)[name]);
        }
    };

    const isFormulaFilled = (formula: string) => {
        let filteredFormula = formula?.replaceAll('pi', '')
        if (shape.code === 'sphere') { filteredFormula = filteredFormula?.replaceAll('t', '') }

        const abcMathSymbols = filteredFormula?.match(/[a-zA-Z]+/g);

        console.log(abcMathSymbols);

        const filteredIsInputCorrect = Object.fromEntries(
            Object.entries(isInputCorrect).filter(([key]) => abcMathSymbols?.includes(key))
        );

        return Object.values(filteredIsInputCorrect).every((v) => v);
    }

    const isAllInputCorrect = () => isFormulaFilled(`v = ${comparisonShapeFormula}`);

    return (
        <main className="w-inherit h-screen bg-white">
            <Head>
                <title>Observasi (2/4) | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            {/* <div className="sticky top-0 z-10 rounded-b-2xl border-shadow-b overflow-hidden"> */}
            <div className="sticky top-0 z-10 bg-black rounded-b-2xl overflow-hidden">
                {comparisonShapeCode && (
                    <ShapePreview
                        height={SHAPE_PREVIEW_DEFAULT_HEIGHT / 2}
                        shapeCode={shape.code}
                        r={observation.r || 0}
                        t={observation.t || 0}
                        highlight={highlight}
                    />
                )}

                <ShapePreview
                    // Kek, this one is horrifying
                    // It will multiply 136 by 2 if 'comparisonShapeCode' is null
                    // Else it will multiply 136 by 1
                    height={SHAPE_PREVIEW_DEFAULT_HEIGHT / 2 * -(+!!comparisonShapeCode - 2)}
                    shapeCode={comparisonShapeCode || shape.code}
                    r={+form.r || 0}
                    t={shape.code === 'sphere' ? +form.r : +form.t || 0}
                    highlight={highlight}
                />
            </div>

            {/* Message */}
            {/* <div className="flex bg-white bg-opacity-95 p-4"> */}

            {/* </div> */}
            {/* </div> */}

            <BottomSheet className="w-inherit">
                {/* Form */}
                <form className="w-inherit pt-4 px-4 pb-space-for-keyboard" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <Message>
                            {MESSAGE_MAP[shape.code]}
                        </Message>

                        {/* Inputs */}
                        <div className="grid grid-cols-1 gap-2">
                            {/* baseShape Input */}
                            {shape.code === 'cylinder' && (
                                <FormControl
                                    label="Bentuk Alas"
                                    symbol="●"
                                    isCorrect={isInputCorrect.baseShape}
                                    name="baseShape"
                                    placeholder="?"
                                    value={form.baseShape}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                />
                            )}

                            {/* formula Input */}
                            {(isInputCorrect.baseShape || shape.code !== 'cylinder') && (
                                <FormControl
                                    label={shape.code === 'cylinder' ? 'Luas Lingkaran' : (comparisonShape ? `Volume ${comparisonShape.name}` : 'Volume')}
                                    symbol={shape.code === 'cylinder' ? 'L' : 'V2'}
                                    isCorrect={isInputCorrect.formula}
                                    name="formula"
                                    placeholder={shape.code === 'cylinder' ? 'Rumus L. Lingkaran' : (comparisonShape ? `Rumus V. ${comparisonShape.name}` : '')}
                                    value={form.formula}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                />
                            )}

                            {isInputCorrect.formula && shape.code === 'sphere' && (
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

                            {isInputCorrect.formula && (
                                <>
                                    <InputOp>=</InputOp>
                                    <div className="grid grid-cols-3">
                                        <div className="col-start-2 col-span-2">
                                            <div className="flex items-center font-mono text-base">
                                                {comparisonShapeFormulaToFormat && comparisonShapeFormulaToFormat
                                                    .replaceAll(' ', '')
                                                    .replaceAll('*', ' * ')
                                                    .replaceAll('^', ' ^')
                                                    .split(' ')
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
                                                                    placeholder={shape.code === 'sphere' && formattedMathSymbol === 't' ? '(r)' : formattedMathSymbol}
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
                                </>
                            )}

                            {/* formulaResult Input */}
                            {comparisonShapeFormulaToFormat && isFormulaFilled(comparisonShapeFormulaToFormat) && (
                                <>
                                    <InputOp>=</InputOp>

                                    <div className="grid grid-cols-3">
                                        <div className="flex items-center">
                                            <Note>
                                                <>
                                                    Nilai π =
                                                    <div
                                                        className="inline-flex text-lg mx-0.5 font-mono"
                                                        dangerouslySetInnerHTML={{
                                                            __html: katex.renderToString(piString.replaceAll('22/7', '\\frac{22}{7}'), { throwOnError: false })
                                                        }}
                                                    />
                                                </>
                                            </Note>
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                suffix={`cm${shape.code === 'cylinder' ? '²' : '³'}`}
                                                name="v"
                                                isCorrect={isInputCorrect.v}
                                                placeholder="?"
                                                value={form.v || ''}
                                                onChange={handleChange}
                                                onFocus={handleFocus}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
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
                    onHide={() => setHighlight(undefined)}
                />
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