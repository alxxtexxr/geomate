import { FormEvent, InputHTMLAttributes, useEffect, useState } from 'react';
import Router from 'next/router';
import { MdOutlineSwitchCamera } from 'react-icons/md';
import { Parser } from 'expr-eval';

// Components
import ShapePreview from '../../../../components/ShapePreview';
import LoaderButton from '../../../../components/LoaderButton';

import BottomSheet from '../../../../components/BottomSheet';

// Utils
import {
    getShape,
    getMathSymbol,
    extractMathSymbolCodes,
    inputValueToNumber,
} from '../../../../Utils';

// Types
import type { ChangeEvent } from 'react';
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../../types/ComponentWithAuth';
import type Shape from '../../../../types/Shape';
import type { Observation } from '@prisma/client';
import type ObservationForm from '../../../../types/ObservationForm';

type Props = {
    observation: Observation,
    shape: Shape,
};

type ObservationInputProps = {
    title: string,
    symbol: string,
    suffix: string,
    canMeasure?: boolean,
};

const ObservationInput = ({ title, symbol, suffix, canMeasure = false, ...rest }: ObservationInputProps & InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <div className="grid grid-cols-3">
            <span className="label-text flex items-self-center items-center text-xs text-gray-800">
                <div className="badge badge-primary badge-outline text-xs h-7 w-7 mr-2">
                    {symbol}
                </div>
                {title}
            </span>
            <div className="col-span-2">
                <div className="flex bg-gray-200 rounded-lg">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="input input-bordered text-xs w-full"
                            {...rest}
                        />
                        {canMeasure && (
                            <button className="absolute right-0 btn bg-transparent hover:bg-transparent hover:text-primary border-0 ml-2">
                                <MdOutlineSwitchCamera className="text-2xl" />
                            </button>
                        )}
                    </div>
                    <div className="flex justify-center items-center text-xs text-gray-400 aspect-square h-12">
                        <span className="-mt-0.5">
                            {suffix}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

type MessageBalloonProps = {
    children: string,
}

const MessageBalloon = ({ children }: MessageBalloonProps) => {
    return (
        <div className="message-balloon message-balloon-base-100">
            {children}
        </div>
    );
};

const ObservationStep1: ComponentWithAuth<Props> = ({ observation, shape }) => {
    const vMathSymbolCodes = extractMathSymbolCodes(shape.vFormula);

    // States
    const [form, setForm] = useState<ObservationForm>({
        PI: 3.14,
        r: getMathSymbol('r').defaultValue!,
        t: getMathSymbol('t').defaultValue!,
        s: 0,
        la: 0,
        lst: 0,
        ka: 0,
        v: 0,
        lp: 0,
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
                    la: +form.la,
                    v: +form.v,
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
        const newV = +Parser.evaluate(shape.vFormula, form).toFixed(1);

        if (newV !== previousV) {
            setForm({
                ...form,
                v: newV
            });
        }
    }, [form]);

    return (
        <main className="w-inherit h-screen bg-black">
            <ShapePreview shapeCode={shape.code} ObservationForm={form} />
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
                                <ObservationInput
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
                            <ObservationInput
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
                        {isSubmitting ? (<LoaderButton />) : (
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