import { useRef, useState, FormEvent, ChangeEvent, FocusEvent, useEffect } from 'react';
import Head from 'next/head'
import Router from 'next/router';
import { Parser } from 'expr-eval';
import katex from 'katex';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import BottomSheet from '../../../../components/BottomSheet';
import { Message, FormControl, Label, Input, InputOp, InputFraction, Keyboard } from '../../../../components/Observation';
import Loading from '../../../../components/Loading';
import Note from '../../../../components/Observation/ObservationNote';

// Constants
import { KEYBOARD_LAYOUTS, SHAPE_PREVIEW_DEFAULT_HEIGHT } from '../../../../Constants';

// Utils
import { getShape, formatFormula, checkFormula, floorToNearest, getPiString, extractFormulaFractionParts } from '../../../../Utils';

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

const MESSAGE_MAP: { [key: string]: string | string[] } = {
    cylinder: 'Untuk menemukan rumus volume tabung, pertama kita perlu mencari luas alasnya terlebih dahulu',
    cone: [
        'Untuk menemukan rumus volume kerucut, kita dapat memanfaatkan rumus volume tabung yang telah kamu pelajari.',
        'Dengan rumus tersebut, yuk kita hitung terlebih dahulu volume tabung dengan jari-jari dan tinggi yang sama dengan kerucut sebelumnya',
    ],
    sphere: [
        'Untuk menghitung volume bola, kita bisa memanfaatkan rumus volume kerucut yang telah kamu pelajari.',
        'Dengan rumus tersebut, yuk kita hitung terlebih dahulu volume kerucut dengan tinggi yang harus sama dengan jari-jarinya, sehingga t = r',
    ]
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
    const comparisonShapeFormulaRounded = shape.code === 'cylinder'
        ? 'roundTo(roundTo(pi*r^2,2),2)' // The formula of area of a circle
        : (comparisonShape && comparisonShape.vFormulaRounded)
    const comparisonShapeFormulaToFormat = shape.code === 'sphere'
        ? 'pi*r^3'
        : comparisonShapeFormula
    const comparisonShapeFormulaFractionParts = shape.code === 'sphere' && comparisonShapeFormula
        ? extractFormulaFractionParts(comparisonShapeFormula)
        : undefined;
    const comparisonShapeFormulaA = comparisonShapeFormulaFractionParts !== undefined
        ? comparisonShapeFormulaFractionParts[0].replaceAll(' ', '').replaceAll('*', ' * ').replaceAll('^', ' ^').split(' ')
        : undefined;

    // Define correct values
    const correctValues = {
        baseShape: 'lingkaran',
        formula: comparisonShapeFormula && formatFormula(comparisonShapeFormula),
        r: observation.r,
        r2: observation.r,
        r3: observation.r,
        t: observation.t,
        v: comparisonShapeFormulaRounded && Parser.evaluate(comparisonShapeFormulaRounded, {
            pi: pi,
            r: observation.r || 0,
            t: shape.code === 'sphere' ? observation.r || 0 : observation.t || 0,
        }).toFixed(2),
        sphereT: 'r',
    };

    // Configure keyboard
    const keyboardRef = useRef(null);
    const keyboardLayouts: { [key: string]: KeyboardLayoutObject } = {
        baseShape: KEYBOARD_LAYOUTS.alphabetic,
        formula: KEYBOARD_LAYOUTS.formula,
        r: KEYBOARD_LAYOUTS.numeric,
        r2: KEYBOARD_LAYOUTS.numeric,
        r3: KEYBOARD_LAYOUTS.numeric,
        t: KEYBOARD_LAYOUTS.numeric,
        v: KEYBOARD_LAYOUTS.numeric,
        sphereT: KEYBOARD_LAYOUTS.alphabeticFormula,
    };

    // States
    const [form, setForm] = useState<ObservationFormValues>({
        baseShape: '',
        formula: '',
        r: '',
        r2: '',
        r3: '',
        t: '',
        v: '',
        sphereT: '',
    });
    const [focusedInputName, setFocusedInputName] = useState<string | null>(null);
    const [isInputCorrect, setIsInputCorrect] = useState({
        baseShape: false,
        formula: false,
        r: false,
        t: false,
        v: false,
        sphereT: false,
        r2: false,
        r3: false,
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
        switch (name) {
            case 'baseShape':
            case 'sphereT':
                console.log(name, value.toLowerCase(), correctValues[name])
                setIsInputCorrect({
                    ...isInputCorrect,
                    [name]: value.toLowerCase() === correctValues[name],
                });
                break;
            case 'formula':
                if (correctValues.formula) {
                    setIsInputCorrect({
                        ...isInputCorrect,
                        formula: checkFormula(value, correctValues.formula),
                    });
                }
                break;
            default:
                console.log(name, +value, +(correctValues as { [key: string]: string | number })[name])
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

        if (shape.code === 'sphere') {
            filteredFormula += ' sphereT r2 r3';
            filteredFormula = filteredFormula?.replaceAll('t', '')
        }

        const abcMathSymbols = filteredFormula?.match(/[a-zA-Z]+/g);

        const filteredIsInputCorrect = Object.fromEntries(
            Object.entries(isInputCorrect).filter(([key]) => abcMathSymbols?.includes(key))
        );

        return Object.values(filteredIsInputCorrect).every((v) => v);
    }

    const isAllInputCorrect = () => isFormulaFilled(`v ${comparisonShapeFormula}`);

    return (
        <main className="w-inherit h-screen bg-white">
            <Head>
                <title>Observasi (2/4) | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

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

            <BottomSheet className="w-inherit">
                {/* Form */}
                <form className="w-inherit pt-4 px-4 pb-space-for-keyboard" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <Message message={MESSAGE_MAP[shape.code]} />

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
                            {((shape.code === 'cylinder' && isInputCorrect.baseShape) || shape.code === 'cone') && (
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

                            {/* {console.log(formulaFractionParts)} */}
                            {shape.code === 'sphere' && (
                                <>
                                    <div className="grid grid-cols-3">
                                        <Label symbol="V2">
                                            Volume Kerucut
                                        </Label>
                                        <div className="col-span-2">
                                            <InputFraction
                                                inputA={(
                                                    <div className="flex items-center font-mono text-base">
                                                        {comparisonShapeFormulaA !== undefined && comparisonShapeFormulaA.map((mathSymbol, i) => {
                                                            const formattedMathSymbol = formatFormula(mathSymbol);
                                                            if (formattedMathSymbol === 't') {
                                                                const name = 'sphereT';

                                                                const isCorrect = (isInputCorrect as { [key: string]: boolean })[name]
                                                                const isCorrectCx = isCorrect ? 'input-primary' : 'input-error';

                                                                return (
                                                                    <input
                                                                        key={i}
                                                                        className={`input input-bordered flex-grow w-16 mx-0.5 ${isCorrectCx}`}
                                                                        placeholder="t"
                                                                        name={name}
                                                                        value={(form as FormValues)[name] || ''}
                                                                        onChange={handleChange}
                                                                        onFocus={handleFocus}
                                                                        readOnly
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
                                                )}
                                                inputB={(
                                                    <input
                                                        className="input input-bordered w-full"
                                                        value="3"
                                                        disabled
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {isInputCorrect.sphereT && (
                                        <>
                                            <InputOp>=</InputOp>
                                            <div className="grid grid-cols-3">
                                                <div className="col-span-2 col-start-2">
                                                    <InputFraction
                                                        inputA={(
                                                            <div className="flex items-center font-mono text-base">
                                                                {comparisonShapeFormulaA !== undefined && comparisonShapeFormulaA.map((mathSymbol, i) => {
                                                                    const formattedMathSymbol = formatFormula(mathSymbol);
                                                                    if (/[a-zA-Z]/.test(formattedMathSymbol)) {
                                                                        const name = 'r' + (i === comparisonShapeFormulaA.indexOf('r') ? 2 : 3);
                                                                        const isCorrect = (isInputCorrect as { [key: string]: boolean })[name];
                                                                        const isCorrectCx = isCorrect ? 'input-primary' : 'input-error';

                                                                        return (
                                                                            <input
                                                                                key={i}
                                                                                className={`input input-bordered flex-grow w-16 mx-0.5 ${isCorrectCx}`}
                                                                                placeholder="r"
                                                                                name={name}
                                                                                value={(form as FormValues)[name] || ''}
                                                                                onChange={handleChange}
                                                                                onFocus={handleFocus}
                                                                                readOnly
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
                                                        )}
                                                        inputB={(
                                                            <input
                                                                className="input input-bordered w-full"
                                                                value="3"
                                                                disabled
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {(isInputCorrect.r2 && isInputCorrect.r3) && (
                                                <>
                                                    <InputOp>=</InputOp>
                                                    <div className="grid grid-cols-3">
                                                        <div className="col-span-2 col-start-2">
                                                            <InputFraction
                                                                inputA={(
                                                                    <div className="flex items-center font-mono text-base">

                                                                        {comparisonShapeFormulaToFormat && comparisonShapeFormulaToFormat
                                                                            .replaceAll(' ', '')
                                                                            .replaceAll('*', ' * ')
                                                                            .replaceAll('^', ' ^')
                                                                            .split(' ')
                                                                            .map((mathSymbol, i) => {
                                                                                const formattedMathSymbol = formatFormula(mathSymbol);
                                                                                if (/[a-zA-Z]/.test(formattedMathSymbol)) {
                                                                                    const name = 'r';
                                                                                    const isCorrect = (isInputCorrect as { [key: string]: boolean })[name];
                                                                                    const isCorrectCx = isCorrect ? 'input-primary' : 'input-error';

                                                                                    return (
                                                                                        <input
                                                                                            key={i}
                                                                                            className={`input input-bordered flex-grow w-16 mx-0.5 ${isCorrectCx}`}
                                                                                            placeholder="r"
                                                                                            name={name}
                                                                                            value={(form as FormValues)[name] || ''}
                                                                                            onChange={handleChange}
                                                                                            onFocus={handleFocus}
                                                                                            readOnly
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
                                                                )}
                                                                inputB={(
                                                                    <input
                                                                        className="input input-bordered w-full"
                                                                        value="3"
                                                                        disabled
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
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
                                                                    readOnly
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
                                                    {piString === '22/7' ? (
                                                        <div
                                                            className="inline-flex text-lg mx-0.5 font-mono"
                                                            dangerouslySetInnerHTML={{
                                                                __html: katex.renderToString(piString.replaceAll('22/7', '\\frac{22}{7}'), { throwOnError: false })
                                                            }}
                                                        />
                                                    ) : ' ' + piString}
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
                                                readOnly
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