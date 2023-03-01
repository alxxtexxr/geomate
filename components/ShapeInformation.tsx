import { Transition } from '@headlessui/react'
import Image from 'next/image';
import Link from 'next/link';
import katex from 'katex';

// Components
import type { Dispatch, SetStateAction } from 'react';
import BottomSheet from '../components/BottomSheet';

// Constant
import { MATH_SYMBOLS } from '../Constants';

// Util
import { getShape, formatFormula } from '../Utils';

// Types
import type { ShapeCode } from '@prisma/client';
import type MathSymbol from '../types/MathSymbol';

type Props = {
    shapeCode: ShapeCode,
    isShowing: boolean,
    setIsShowing: Dispatch<SetStateAction<boolean>>,
    onHide?: () => void,
};

const ShapeInformation = ({ shapeCode, isShowing, setIsShowing, onHide }: Props) => {
    const shape = getShape(shapeCode);

    let vFormulaSymbols: MathSymbol[] = [];
    MATH_SYMBOLS.map((mathSymbol) => {
        const i = ('v' + shape.vFormula).indexOf(mathSymbol.code);

        if (i > -1) {
            vFormulaSymbols[i] = mathSymbol;
        }
    });

    let lpFormulaSymbols: MathSymbol[] = [];
    MATH_SYMBOLS.map((mathSymbol) => {
        const i = ('lp' + shape.lpFormula).indexOf(mathSymbol.code);

        if (i > -1) {
            lpFormulaSymbols[i] = mathSymbol;
        }
    });

    return (
        <Transition
            appear={true}
            show={isShowing}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="w-inherit"
        >
            <div className="absolute inset-0 bg-black bg-opacity-60 w-inherit overflow-y-scroll">
                {/* Overlay */}
                <Transition.Child
                    enter="transition-height duration-300"
                    enterFrom="h-screen"
                    enterTo="h-80"
                    leave="transition-height duration-300"
                    leaveFrom="h-80"
                    leaveTo="h-screen"
                >
                    <div className="h-full" onClick={() => {
                        setIsShowing(false);
                        if (onHide) {
                            onHide();
                        }
                    }} />
                </Transition.Child>

                {/* Bottom Sheet */}
                <BottomSheet className="pt-12">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-full">
                        <div className="relative flex-none h-12 w-12">
                            <Image src={`/images/${shape.code}.png`} alt={shape.name} layout="fill" />
                        </div>
                    </div>

                    <div className="z-10 text-center mb-8 px-4">
                        <h1 className="text-gray-800 text-lg font-semibold mb-1">{shape.name}</h1>
                        <p className="text-sm">{shape.description}</p>
                    </div>

                    <table className="w-full mb-2">
                        <tbody>
                            {/* <tr className="border-t">
                                <td className="py-2">
                                    <h2>
                                        <div className="badge badge-primary badge-outline text-xs font-medium w-8 mr-2 -mt-0.5">
                                            •
                                        </div>
                                        Jumlah Sudut
                                    </h2>
                                </td>
                                <td className="text-gray-800 text-right font-medium py-2">
                                    {shape.nVertices}
                                </td>
                            </tr>
                            <tr className="border-t">
                                <td className="py-2">
                                    <h2>
                                        <div className="badge badge-primary badge-outline text-xs font-medium w-8 mr-2 -mt-0.5">
                                            △
                                        </div>
                                        Jumlah Rusuk
                                    </h2>
                                </td>
                                <td className="text-gray-800 text-right font-medium py-2">
                                    {shape.nEdges}
                                </td>
                            </tr>
                            <tr className="border-t">
                                <td className="py-2">
                                    <h2>
                                        <div className="badge badge-primary badge-outline text-xs font-medium w-8 mr-2 -mt-0.5">
                                            ▲
                                        </div>
                                        Jumlah Sisi
                                    </h2>
                                </td>
                                <td className="text-gray-800 text-right font-medium py-2">
                                    {shape.nFaces}
                                </td>
                            </tr> */}

                            {/* V Formula Row */}
                            <tr className="border-t">
                                <td colSpan={2} className="py-2">
                                    <h2 className="mb-8">
                                        <div className="badge badge-primary badge-outline text-xs font-medium w-8 mr-2 -mt-0.5">
                                            V
                                        </div>
                                        Rumus Volume
                                    </h2>

                                    {/* V Formula */}
                                    <div className="px-8 mb-8">
                                        <div
                                            className="text-gray-800 text-center font-medium mb-2"
                                            dangerouslySetInnerHTML={{
                                                __html: katex.renderToString('V = ' + formatFormula(shape.vFormula), { throwOnError: false })
                                            }}
                                        />
                                        <div className="text-xs text-center">
                                            {vFormulaSymbols.map((vFormulaSymbol, i) => (
                                                <span key={i}>
                                                    <span className="font-medium">{vFormulaSymbol.symbol}</span>
                                                    = {vFormulaSymbol.title}
                                                    {i + 1 < vFormulaSymbols.length && ', '}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Link href={`/stimulation/${shapeCode}`}>
                                        <button className="btn btn-primary btn-outline w-full">
                                            Pelajari Volume
                                        </button>
                                    </Link>
                                </td>
                            </tr>

                            {/* LP Formula Row */}
                            <tr className="border-t">
                                <td colSpan={2} className="py-2">
                                    <h2 className="mb-8">
                                        <div className="badge badge-primary badge-outline text-xs font-medium w-8 mr-2 -mt-0.5">
                                            V
                                        </div>
                                        Rumus Luas Permukaan
                                    </h2>

                                    {/* LP Formula */}
                                    <div className="px-8 mb-8">
                                        <div
                                            className="text-gray-800 text-center font-medium mb-1"
                                            dangerouslySetInnerHTML={{
                                                __html: katex.renderToString('LP = ' + formatFormula(shape.lpFormula), { throwOnError: false })
                                            }}
                                        />
                                        <div className="text-xs text-center">
                                            {lpFormulaSymbols.map((lpFormulaSymbol, i) => (
                                                <span key={i}>
                                                    <span className="font-medium">{lpFormulaSymbol.symbol}</span>
                                                    = {lpFormulaSymbol.title}
                                                    {i + 1 < lpFormulaSymbols.length && ', '}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Link href={`/stimulation/${shapeCode}`}>
                                        <button className="btn btn-primary btn-outline w-full">
                                            Pelajari Luas Permukaan
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </BottomSheet>
            </div>
        </Transition>
    );
};

export default ShapeInformation;