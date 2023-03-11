import { useRef, useState, useEffect, FormEvent, ChangeEvent, FocusEvent } from 'react';
import Head from 'next/head'
import Router from 'next/router';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import BottomSheet from '../../../../components/BottomSheet';
import MessageBalloon from '../../../../components/MessageBalloon';
import { FormControl, Spinner, Keyboard } from '../../../../components/Observation';
import Loading from '../../../../components/Loading';

// Utils
import { getShape } from '../../../../Utils';

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

const ObservationStep3: ComponentWithAuth<Props> = ({ observation, shape }) => {
    // Define comparisonShape
    const comparisonShapeCodes: { [key: string]: ShapeCode | null } = {
        cylinder: null,
        cone: 'cylinder',
        sphere: 'cone',
    };
    const comparisonShapeCode = comparisonShapeCodes[shape.code];
    const comparisonShape = comparisonShapeCode && getShape(comparisonShapeCode);

    // Configure keyboard
    const keyboardRef = useRef(null);
    const numericKeyboardLayout = {
        default: [
            '1 2 3 4 5 {bksp}',
            '6 7 8 9 0 .',
        ],
    };
    const keyboardLayouts: { [key: string]: KeyboardLayoutObject } = {
        n: numericKeyboardLayout,
    };

    // States
    const [form, setForm] = useState<ObservationFormValues>({
        n: '1',
    });
    const [focusedInputName, setFocusedInputName] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setN = (n: number) => {
        setForm({
            ...form,
            n: '' + n,
        });

        if (keyboardRef.current) {
            (keyboardRef.current as any).setInput('' + n);
        }
    }

    // Define n variables
    const nOp = shape.code === 'cone' ? '× 1/' : '×';
    const nComparisonV = observation.comparisonV
        ? (shape.code === 'cone'
            ? (observation.comparisonV / +form.n).toFixed(1)
            : (observation.comparisonV * +form.n).toFixed(1))
        : '';
    const isNComparisonVCorrect = +nComparisonV === observation.v;

    // Define shape height
    const shapeTs: { [key: string]: number } = {
        cylinder: observation.t ? observation.t * +form.n : 0,
        cone: observation.t ? observation.t / +form.n : 0,
        sphere: observation.r || 0,
    };

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

    return (
        <main className="w-inherit h-screen bg-white">
            <Head>
                <title>Observasi (3/4) | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <div className="sticky top-0 z-10 rounded-b-2xl border-shadow-b overflow-hidden">
                <div className="rounded-b-2xl shadow overflow-hidden">
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
                        r={observation.r || 0}
                        t={shapeTs[shape.code]}
                        n={shape.code === 'sphere' ? +form.n : 1}
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
                            {/* comparisonV Input */}
                            <FormControl
                                title={comparisonShape ? `V. ${comparisonShape.name}` : ''}
                                symbol="v2"
                                suffix="cm³"
                                name="comparisonV"
                                value={observation.comparisonV || ''}
                                disabled
                            />

                            {/* n input */}
                            <div className="grid grid-cols-3">
                                <div className="col-start-2 col-span-2">
                                    <div className="flex items-center font-mono text-base">
                                        {nOp.split('').map((c, i) => (
                                            <div className="mx-0.5" key={i}>
                                                {c}
                                            </div>
                                        ))}
                                        <Spinner
                                            name="n"
                                            value={form.n}
                                            setValue={setN}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* nComparisonV Input */}
                            <FormControl
                                suffix="cm³"
                                name="nComparisonV"
                                value={nComparisonV}
                                isCorrect={isNComparisonVCorrect}
                                disabled
                            />

                            <hr />
                            {/* formulaResult Input */}
                            <FormControl
                                title={`V. ${shape.name}`}
                                symbol="v1"
                                suffix="cm³"
                                isCorrect={isNComparisonVCorrect}
                                name="v"
                                value={observation.v || 0}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-inherit p-4">
                        {isSubmitting ? (<Loading.Button />) : (
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={!isNComparisonVCorrect}
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

ObservationStep3.auth = true;

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

export default ObservationStep3;