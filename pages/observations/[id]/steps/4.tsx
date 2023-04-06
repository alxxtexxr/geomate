import { useRef, useState, useEffect, FormEvent, ChangeEvent, FocusEvent } from 'react';
import Head from 'next/head'
import Router from 'next/router';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import BottomSheet from '../../../../components/BottomSheet';
import { Message, FormControl, Input, Label, InputOp, InputFraction, Keyboard } from '../../../../components/Observation';
import Loading from '../../../../components/Loading';

// Constants
import { KEYBOARD_LAYOUTS } from '../../../../Constants';

// Utils
import { getShape, formatFormula, checkFormula, extractFormulaFractionParts } from '../../../../Utils';

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

const INPUT_OP_MAP: { [key: string]: string } = {
    cylinder: '×',
    cone: '÷',
    sphere: '×',
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
        : (comparisonShape && comparisonShape.vFormula);
    const comparisonShapeFormulaFractionParts = shape.code === 'sphere' && comparisonShapeFormula
        ? extractFormulaFractionParts(comparisonShapeFormula)
        : undefined;
    const comparisonShapeFormulaA = comparisonShapeFormulaFractionParts !== undefined
        ? comparisonShapeFormulaFractionParts[0].replaceAll(' ', '').replaceAll('*', ' * ').replaceAll('^', ' ^').split(' ')
        : undefined;

    // Configure keyboard
    const keyboardRef = useRef(null);
    const keyboardLayouts: { [key: string]: KeyboardLayoutObject } = {
        comparisonVFormula: KEYBOARD_LAYOUTS.formula,
        n: KEYBOARD_LAYOUTS.numeric,
        vFormula: KEYBOARD_LAYOUTS.formula,
        vFormulaA: KEYBOARD_LAYOUTS.formula,
        vFormulaB: KEYBOARD_LAYOUTS.formula,
        sphereT: KEYBOARD_LAYOUTS.alphabeticFormula,
        x1: KEYBOARD_LAYOUTS.formula,
        x2: KEYBOARD_LAYOUTS.formula,
        x3: KEYBOARD_LAYOUTS.formula,
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
        vFormulaA: comparisonShapeFormula && formatFormula(comparisonShapeFormula),
        vFormulaB: correctNs[shape.code],
        sphereT: 'r',
    };

    // States
    const [sphereVFormulaACorrectValues, setSphereVFormulaACorrectValues] = useState(['4', 'π', 'r³']);
    const [sphereVFormulaAInputtedValues, setSphereVFormulaAInputtedValues] = useState<ObservationFormValues>({
        x1: '',
        x2: '',
        x3: '',
    });

    const [form, setForm] = useState<ObservationFormValues>({
        comparisonVFormula: '',
        n: '',
        vFormula: '',
        vFormulaA: '',
        vFormulaB: '',
        sphereT: '',
        x1: '',
        x2: '',
        x3: '',
    });
    const [focusedInputName, setFocusedInputName] = useState<string | null>(null);
    const [isInputCorrect, setIsInputCorrect] = useState({
        comparisonVFormula: false,
        n: false,
        vFormula: false,
        vFormulaA: false,
        vFormulaB: false,
        sphereT: false,
        x1: false,
        x2: false,
        x3: false,
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

        try {
            await fetch(`/api/observations/${observation.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isCompleted: true,
                }),
            });

            await Router.push(`/observations/${observation.id}/result`);
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

    const isAllInputCorrect = () =>
        Object.entries(isInputCorrect).every(([input, value]) =>
            // Don't check 'n', 'vFormulaA', 'vFormulaB', 'sphereT', 'x1', 'x2', 'x3' if the shape is cylinder
            shape.code === 'cylinder' && (input === 'n' || input === 'vFormulaA' || input === 'vFormulaB' || input === 'sphereT' || input === 'x1' || input === 'x2' || input === 'x3') ||
            // Don't check 'vFormula', 'sphereT', 'x1', 'x2', 'x3' if the shape is cylinder
            shape.code === 'cone' && (input === 'vFormula' || input === 'sphereT' || input === 'x1' || input === 'x2' || input === 'x3') ||
            // Don't check 'comparisonVFormula', 'vFormulaA', 'vFormulaB', 'vFormula' if the shape is cylinder
            shape.code === 'sphere' && (input === 'comparisonVFormula' || input === 'vFormulaA' || input === 'vFormulaB' || input === 'vFormula') ||
            value
        );

    const updateXn = (xn: string) => {
        setSphereVFormulaACorrectValues((prevSetSphereVFormulaACorrectValues) => {
            if (form[xn]) {
                const filteredValues = prevSetSphereVFormulaACorrectValues?.filter((prevSetSphereVFormulaACorrectValue) => {
                    // If x-n value is exist in prevSetSphereVFormulaACorrectValues,
                    // Update x-n status into correct
                    // Don't return the values into prevSetSphereVFormulaACorrectValues
                    if (prevSetSphereVFormulaACorrectValue === form[xn]) {
                        setIsInputCorrect((prevIsInputCorrect) => ({
                            ...prevIsInputCorrect,
                            [xn]: true,
                        }));
                        setSphereVFormulaAInputtedValues((prevSetSphereVFormulaAInputtedValues) => ({
                            ...prevSetSphereVFormulaAInputtedValues,
                            [xn]: form[xn],
                        }))

                        return false;
                    } else {
                        return true;
                    }
                });

                return filteredValues;
                // If x-n value is empty,
                // Update x-n status into incorrect
                // Add previous x-n value into sphereVFormulaACorrectValues
                // Remove previous x-n value from sphereVFormulaAInputtedValues
            } else {
                // console.log('test')
                setIsInputCorrect((prevIsInputCorrect) => ({
                    ...prevIsInputCorrect,
                    [xn]: false,
                }));

                const addedValues = sphereVFormulaAInputtedValues[xn] ? [
                    ...prevSetSphereVFormulaACorrectValues,
                    sphereVFormulaAInputtedValues[xn],
                ] : prevSetSphereVFormulaACorrectValues;

                setSphereVFormulaAInputtedValues((prevSetSphereVFormulaAInputtedValues) => ({
                    ...prevSetSphereVFormulaAInputtedValues,
                    [xn]: '',
                }))

                return addedValues;
            }
        });
    }

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
        setIsInputCorrect((prevIsInputCorrect) => ({
            ...prevIsInputCorrect,
            n: +form.n === correctValues.n,
        }));

        // Check if vFormula is correct
        if (form.vFormula && correctValues.vFormula) {
            // console.log('vFormula', form.vFormula, correctValues.vFormula, checkFormula('' + form.vFormula, correctValues.vFormula))
            setIsInputCorrect({
                ...isInputCorrect,
                vFormula: checkFormula('' + form.vFormula, correctValues.vFormula),
            });
        }

        // Check if vFormulaA is correct
        if (form.vFormulaA && correctValues.vFormulaA) {
            // console.log('vFormulaA', form.vFormulaA, correctValues.vFormulaA, checkFormula('' + form.vFormulaA, correctValues.vFormulaA))
            setIsInputCorrect({
                ...isInputCorrect,
                vFormulaA: checkFormula('' + form.vFormulaA, correctValues.vFormulaA),
            });
        }

        // Check if vFormulaB is correct
        setIsInputCorrect((prevIsInputCorrect) => ({
            ...prevIsInputCorrect,
            vFormulaB: +form.vFormulaB === correctValues.vFormulaB,
        }));

        // Check if sphereT is correct
        setIsInputCorrect((prevIsInputCorrect) => ({
            ...prevIsInputCorrect,
            sphereT: form.sphereT === correctValues.sphereT,
        }));

        updateXn('x1');
        updateXn('x2');
        updateXn('x3');
    }, [form]);

    return (
        <main className="w-inherit h-screen bg-white">
            <Head>
                <title>Observasi (4/4) | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <div className="sticky top-0 z-10 bg-black rounded-b-2xl overflow-hidden">
                <ShapePreview
                    height={272}
                    shapeCode={shape.code}
                    r={observation.r || 0}
                    t={observation.t || 0}
                />
            </div>

            <BottomSheet className="w-inherit">
                {/* Form */}
                <form className="w-inherit pt-4 px-4 pb-space-for-keyboard" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <Message messages={[`Dari observasi yang telah dilakukan, dapat disimpulkan bahwa rumus volume ${shape.name.toLowerCase()} adalah:`]} />

                        {/* Inputs */}
                        <div className="grid grid-cols-1 gap-2">
                            {/* comparisonVFormula Input */}
                            {shape.code === 'cylinder' && (
                                <div className="grid grid-cols-3">
                                    <Label symbol="V">{`Volume ${shape.name}`}</Label>
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
                            )}
                            {shape.code === 'cone' && (
                                <FormControl
                                    label={`Rumus V. ${shape.name}`}
                                    symbol="V"
                                    isCorrect={isInputCorrect.comparisonVFormula}
                                    name="comparisonVFormula"
                                    placeholder={comparisonShape ? `Rumus V. ${comparisonShape.name}` : ''}
                                    value={form.comparisonVFormula}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                />
                            )}
                            {shape.code === 'sphere' && (
                                <div className="grid grid-cols-3">
                                    <Label symbol="V2">
                                        Rumus V. Bola
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
                            )}

                            {shape.code !== 'cylinder' && (
                                <>
                                    <InputOp>{INPUT_OP_MAP[shape.code]}</InputOp>
                                    {/* n input */}
                                    <div className="grid grid-cols-3">
                                        <div className="col-start-2 col-span-2">
                                            <Input
                                                name="n"
                                                isCorrect={isInputCorrect.n}
                                                placeholder="?"
                                                value={form.n}
                                                onChange={handleChange}
                                                onFocus={handleFocus}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <InputOp>=</InputOp>

                            {/* vFormula Input */}
                            {shape.code === 'cylinder' && (
                                <FormControl
                                    name="vFormula"
                                    isCorrect={isInputCorrect.vFormula}
                                    placeholder={`Rumus V. ${shape.name}`}
                                    value={form.vFormula}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                />
                            )}
                            {shape.code === 'cone' && (
                                <div className="grid grid-cols-3">
                                    <div className="col-start-2 col-span-2">
                                        <InputFraction
                                            inputA={(
                                                <Input
                                                    name="vFormulaA"
                                                    isCorrect={isInputCorrect.vFormulaA}
                                                    placeholder={`Rumus V. ${comparisonShape?.name}`}
                                                    value={form.vFormulaA}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                />
                                            )}
                                            inputB={(
                                                <Input
                                                    name="vFormulaB"
                                                    isCorrect={isInputCorrect.vFormulaB}
                                                    placeholder={`?`}
                                                    value={form.vFormulaB}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                            {shape.code === 'sphere' && (
                                <div className="grid grid-cols-3">
                                    <div className="col-span-2 col-start-2">
                                        <InputFraction
                                            inputA={(
                                                <div className="flex items-center font-mono text-base">
                                                    {comparisonShapeFormulaFractionParts !== undefined && comparisonShapeFormulaFractionParts[0]
                                                        .replaceAll(' ', '')
                                                        .replaceAll('*', ' * ')
                                                        .split(' ')
                                                        .map((mathSymbol, i) => {
                                                            if (/[a-zA-Z]/.test(mathSymbol)) {
                                                                const name = 'x' + (i / 2 + 1);

                                                                const isCorrect = (isInputCorrect as { [key: string]: boolean })[name]
                                                                const isCorrectCx = isCorrect ? 'input-primary' : 'input-error';

                                                                return (
                                                                    <input
                                                                        key={i}
                                                                        className={`input input-bordered flex-grow w-12 mx-0.5 ${isCorrectCx}`}
                                                                        placeholder="?"
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
                                                                        {formatFormula(mathSymbol)}
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
                                Selesai
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