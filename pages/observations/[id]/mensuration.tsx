import { InputHTMLAttributes, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Plane } from '@react-three/drei';
import { HiOutlineCube } from 'react-icons/hi';
import Router from 'next/router';
import { MdOutlineSwitchCamera } from 'react-icons/md';
import { Parser } from 'expr-eval';

// Components
import ShapeComponent from '../../../components/Shape';
import Swap from '../../../components/Swap';
import ShapePreview from '../../../components/ShapePreview';
import ConditionalInput from '../../../components/ConditionalInput';
import LoaderButton from '../../../components/LoaderButton';
import XRMeasurement from '../../../components/XRMeasurement';

import BottomSheet from '../../../components/BottomSheet';

// Constants
import { MATH_SYMBOLS, DEFAULT_SIZE } from '../../../Constants';

// Utils
import {
    getShape,
    getMathSymbolTitle,
    formatFormulaToKatex,
    evaluateFormula,
    inputValueToNumber,
} from '../../../Utils';

// Types
import type { ChangeEvent } from 'react';
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../types/ComponentWithAuth';
import type Shape from '../../../types/Shape';
import type { Observation } from '@prisma/client';
import type ObservationForm from '../../../types/ObservationForm';
import type MathSymbol from '../../../types/MathSymbol';

type Props = {
    observation: Observation,
    shape: Shape,
};

// const LA_FORMULAS: { [key: number]: string } = {
//     3: '( 1 / 2 ) * baseA * baseT',
//     4: 'baseS ^ 2',
// };

type MensurationInputProps = {
    title: string,
    symbol: string,
    suffix: string,
    canMeasure?: boolean,
}

const MensurationInput = ({ title, symbol, suffix, canMeasure = false, ...rest }: MensurationInputProps & InputHTMLAttributes<HTMLInputElement>) => {
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

const Mensuration: ComponentWithAuth<Props> = ({ observation, shape }) => {
    const hasBaseWithVertices = ['prism', 'pyramid'].includes(shape.code);
    const hasR = ['sphere', 'cylinder', 'cone'].includes(shape.code);
    const hasT = ['cylinder', 'prism', 'cone', 'pyramid'].includes(shape.code);

    // States
    const [form, setForm] = useState<ObservationForm>({
        baseA: 0,
        baseT: 0,
        baseS: 0,
        nBaseVertices: hasBaseWithVertices ? 3 : 0,
        nVertices: 0,
        nEdges: 0,
        nFaces: 0,
        PI: 3.14,
        r: hasR ? DEFAULT_SIZE : 0,
        t: hasT ? DEFAULT_SIZE * 2 : 0,
        s: 0,
        la: 0,
        lst: 0,
        ka: 0,
        v: 0,
        lp: 0,
    });
    // const [tabs, setTabs] = useState<any>([
    // ...(hasBaseWithVertices ? [
    //     {
    //         title: 'Bentuk Alas',
    //         code: 'baseShape',
    //         symbol: null,
    //     }
    // ] : []),
    // ...MATH_SYMBOLS.filter((mathSymbol) => (shape.vFormula + 'v').includes(mathSymbol.code)),
    // ]);
    // const [activeTabI, setActiveTabI] = useState(0);
    // const [wireframe, setWireframe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [isLivePreviewing, setIsLivePreviewing] = useState(false);
    // const [isMeasuring, setIsMeasuring] = useState(false);


    // const correctValues: { [key: string]: number } = {
    //     la: hasBaseWithVertices ? +Parser.evaluate(LA_FORMULAS[form.nBaseVertices], form).toFixed(1) : 0,
    //     v: +Parser.evaluate(shape.vFormula, form).toFixed(1),
    // };

    // Functions
    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            await fetch(`/api/observations/${observation.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    // Convert LA and V to number
                    la: +form.la,
                    v: +form.v,
                }),
            });

            await Router.push(`/observations/${observation.id}`);
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
        }
    };

    // const calculateVolume = () => 

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // setForm((_form) => ({
        //     ..._form,
        //     [e.target.name]: inputValueToNumber(e.target.value),
        // }));

        setForm({
            ...form,
            [e.target.name]: inputValueToNumber(e.target.value),
        });
    };

    // Effects
    useEffect(() => {
        // Calculate object volume
        const previousV = form.v;
        const newV = +Parser.evaluate(shape.vFormula, form).toFixed(1);

        if (newV !== previousV) {
            setForm({
                ...form,
                v: newV
            });
        }

        // if (form.nBaseVertices) {
        //     const baseParams: { [key: number]: { form: any, symbols: MathSymbol[] } } = {
        //         3: {
        //             form: { baseA: DEFAULT_SIZE, baseT: DEFAULT_SIZE },
        //             symbols: MATH_SYMBOLS.filter((mathSymbol) => ['baseA', 'baseT'].includes(mathSymbol.code))
        //         },
        //         4: {
        //             form: { baseS: DEFAULT_SIZE },
        //             symbols: MATH_SYMBOLS.filter((mathSymbol) => ['baseS'].includes(mathSymbol.code))
        //         },
        //     };

        //     // Get all symbols of addtional tabs
        //     let addTabSymbols: string[] = [];
        //     Object.keys(baseParams).map((key) => {
        //         baseParams[+key].symbols.map((addTab) =>
        //             addTabSymbols.push(addTab.code)
        //         );
        //     });

        //     // Remove additional tabs
        //     const [firstTab, ...restTabs] = tabs.filter((tab: any) => !addTabSymbols.includes(tab.code));

        //     // Update form
        //     setForm((_form) => ({
        //         ..._form,
        //         ...baseParams[_form.nBaseVertices].form
        //     }));

        //     // Add additional tabs
        //     setTabs([
        //         firstTab,
        //         ...baseParams[form.nBaseVertices].symbols,
        //         ...restTabs,
        //     ]);
        // }
    }, [form]);

    return (
        <main className="w-inherit h-screen bg-black">
            <ShapePreview shapeCode={shape.code} ObservationForm={form} />
            <BottomSheet>
                <div className="grid grid-cols-1 gap-4 pt-4">
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

                    {/* Tab #1 */}
                    <div className="grid grid-cols-1 gap-2">
                        {['r', 't'].map((symbolCode) => shape.vFormula.includes(symbolCode) && (
                            <MensurationInput
                                key={symbolCode}
                                title={getMathSymbolTitle(symbolCode)}
                                symbol={symbolCode}
                                suffix="cm"
                                canMeasure
                                name={symbolCode}
                                value={(form as { [key: string]: number })[symbolCode]}
                                onChange={handleChange}
                            />
                        ))}
                        <hr />
                        <MensurationInput
                            title="Volume"
                            symbol="v"
                            suffix="cm²"
                            value
                            ={form.v}
                            disabled
                        />
                    </div>
                </div>

                {/* Stepper */}
                {/* <ul className="steps steps-horizontal bg-white text-xs py-4 border-b border-gray-200">
                    {tabs.map((tab, i) => (
                        <li className={'step' + (i <= activeTabI ? ' step-primary' : '')} key={i}>
                            {tab.title}
                        </li>
                    ))}
                </ul> */}

                {/* <div className="grid grid-cols-1 gap-4 bg-white pt-2">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex justify-center items-center text-sm text-gray-800">
                                {tabs[activeTabI].symbol && (
                                    <div className="badge badge-primary badge-outline text-xs font-semibold w-8 mr-2 -mt-0.5">
                                        {tabs[activeTabI].symbol}
                                    </div>
                                )}
                                {tabs[activeTabI].title}
                            </span>
                        </label>
                        // Base Shape
                        {tabs[activeTabI].code === 'baseShape' ? (
                            <div>
                                {(shape.code === 'prism' || shape.code === 'pyramid') && (
                                    <select
                                        className="select select-bordered w-full font-normal"
                                        name="nBaseVertices"
                                        value={form.nBaseVertices}
                                        onChange={handleChange}
                                    >
                                        <option value="3">Segitiga</option>
                                        <option value="4">Persegi</option>
                                    </select>
                                )}
                            </div>
                        ) : (
                            // LA (Luas Alas)
                            tabs[activeTabI].code === 'la' ? (
                                <>
                                    <label className="input-group mb-4">
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            value={formatFormulaToKatex(LA_FORMULAS[form.nBaseVertices])}
                                            disabled
                                        />
                                        <span className="text-xs font-semibold">cm³</span>
                                    </label>
                                    <label className="input-group mb-4">
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            value={formatFormulaToKatex(evaluateFormula(form, LA_FORMULAS[form.nBaseVertices]))}
                                            disabled
                                        />
                                        <span className="text-xs font-semibold">cm³</span>
                                    </label>
                                    <ConditionalInput
                                        correctValue={'' + correctValues.la}
                                        incorrectMessage="Nilai belum benar."
                                        suffix="cm³"
                                        onChange={handleChange}
                                        name="la"
                                        value={form.la}
                                    />
                                </>
                            ) : (
                                // Volume
                                tabs[activeTabI].code === 'v' ? (
                                    <>
                                        // <label className="input-group mb-4">
                                            <input
                                                type="text"
                                                className="input input-bordered w-full"
                                                value={formatFormulaToKatex(shape.vFormula)}
                                                disabled
                                            />
                                            <span className="text-xs font-semibold">cm³</span>
                                        </label>
                                        <label className="input-group mb-4">
                                            <input
                                                type="text"
                                                className="input input-bordered w-full"
                                                value={formatFormulaToKatex(evaluateFormula(form, shape.vFormula))}
                                                disabled
                                            />
                                            <span className="text-xs font-semibold">cm³</span>
                                        </label> //
                                        <ConditionalInput
                                            correctValue={'' + correctValues.v}
                                            incorrectMessage="Nilai belum benar."
                                            suffix="cm³"
                                            onChange={handleChange}
                                            name="v"
                                            value={form.v}
                                        />
                                    </>
                                ) : (
                                    <label className="input-group">
                                        <input
                                            type="text"
                                            placeholder="0"
                                            className="input input-bordered w-full"
                                            name={tabs[activeTabI].code}
                                            value={(form as { [key: string]: any })[tabs[activeTabI].code]}
                                            onChange={handleChange}
                                        />
                                        <span className="text-xs font-semibold">cm</span>
                                    </label>
                                )))}
                    </div>
                    {!['baseShape', 'la', 'v'].includes(tabs[activeTabI].code) && (
                        <button className="btn btn-primary" onClick={() => setIsMeasuring(true)}>
                            <MdOutlineSwitchCamera className="text-2xl mr-2" />
                            <span style={{ marginBottom: -1 }}>
                                Ukur dengan Kamera
                            </span>
                        </button>
                    )}
                </div> */}

                {/* <div className="absolute z-10 left-0 bottom-0 grid grid-cols-2 gap-4 bg-white bg-opacity-95 w-inherit p-4 border-t border-gray-200">
                    <button
                        className="btn btn-primary btn-outline w-full"
                        // If it's first tab, disable prev button
                        {...(activeTabI > 0 ? {
                            onClick: () => setActiveTabI(activeTabI - 1)
                        } : {
                            disabled: true,
                        })}
                    >
                        Sebelumnya
                    </button>
                    {activeTabI + 1 < tabs.length ? (
                        < button
                            className="btn btn-primary w-full"
                            // If LA is incorrect, disable next button
                            {...((tabs[activeTabI].code === 'la' && +form.la !== correctValues.la) ? {
                                disabled: true,
                            } : {
                                onClick: () => setActiveTabI(activeTabI + 1)
                            })}
                        >
                            Selanjutnya
                        </button>
                    ) : (
                        isSubmitting ? (
                            <LoaderButton />
                        ) : (
                            <button
                                className="btn btn-primary w-full"
                                // If V is incorrect, disable submit button
                                {...((tabs[activeTabI].code === 'v' && +form.v !== correctValues.v) ? {
                                    disabled: true,
                                } : {
                                    onClick: handleSubmit,
                                })}
                            >
                                Selesai
                            </button>
                        )

                    )}
                </div> */}
            </BottomSheet>


            {/* XR Measurement */}
            {/* {isMeasuring && (
                <XRMeasurement
                    onSubmit={(distance: number) => {
                        setForm((_form) => ({
                            ..._form,
                            [tabs[activeTabI].code]: distance,
                        }));
                        setIsMeasuring(false);
                    }}
                    onClose={() => setIsMeasuring(false)}
                />
            )} */}
        </main >
    );
};

Mensuration.auth = true;

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

export default Mensuration;
