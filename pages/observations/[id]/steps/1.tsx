import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head'
import Router from 'next/router';
import { Parser } from 'expr-eval';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import BottomSheet from '../../../../components/BottomSheet';
import MessageBalloon from '../../../../components/MessageBalloon';
import { FormControl } from '../../../../components/Observation';
import Loading from '../../../../components/Loading';

// Utils
import { getShape, getMathSymbol, extractMathSymbolCodes, inputValueToNumber } from '../../../../Utils';

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

    // States
    const [form, setForm] = useState<ObservationFormValues>({
        r: getMathSymbol('r').defaultValue!,
        t: getMathSymbol('t').defaultValue!,
        v: '',
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
                    ...form,
                    la: +(form.la || 0),
                    v: +(form.v || 0),
                }),
            });

            await Router.push(`/observations/${observation.id}/steps/2`);
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm({
            ...form,
            [e.target.name]: inputValueToNumber(e.target.value),
        });

    const isFormFilled = () =>
        vMathSymbolCodes.every((mathSymbolCode) => (form as { [key: string]: number })[mathSymbolCode] > 0);

    // Effects
    useEffect(() => {
        // Calculate the volume
        const previousV = form.v;
        const newV = +Parser.evaluate(shape.vFormula, {
            ...form,
            pi: 3.14,
        }).toFixed(1);

        if (newV !== previousV) {
            setForm({
                ...form,
                v: newV
            });
        }
    }, [form]);

    return (
        <main className="w-inherit h-screen bg-black">
            <Head>
                <title>Observasi (1/4) | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <ShapePreview
                shapeCode={shape.code}
                r={+form.r || 0}
                t={+form.t || 0}
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
                            {vMathSymbolCodes.map((mathSymbolCode) => (
                                <FormControl
                                    key={mathSymbolCode}
                                    title={getMathSymbol(mathSymbolCode).title}
                                    symbol={mathSymbolCode}
                                    suffix="cm"
                                    canMeasure
                                    name={mathSymbolCode}
                                    value={(form as { [key: string]: number })[mathSymbolCode]}
                                    onChange={handleChange}
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
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-inherit p-4">
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