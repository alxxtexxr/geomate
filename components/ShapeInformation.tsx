import { Fragment, useState } from 'react';
import Link from 'next/link';
import { Transition } from '@headlessui/react';
import { MdRemoveRedEye } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';

// Component
import ShapePreview from './ShapePreview';

// Util
import { getShape, formatFormula, extractMathSymbolCodes, getMathSymbol } from '../Utils';

// Types
import type { ShapeCode } from '@prisma/client';

type Props = {
    shapeCode?: ShapeCode,
    onHide: () => void,
};

const ShapeInformation = ({ shapeCode, onHide }: Props) => {
    const shape = shapeCode && getShape(shapeCode);
    const isShowing = !!shapeCode;
    const mathSymbolCodes = shape !== undefined ? extractMathSymbolCodes(shape.vFormula, true) : [];

    // State
    const [highlight, setHighlight] = useState<string>()

    return (
        <Transition
            show={isShowing}
            className="absolute inset-0 bg-black bg-opacity-60 w-inherit overflow-y-scroll"
            // Enter Animation
            enter="transform duration-500 transition ease-in-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            // Leave Animation
            leave="transform duration-500 transition ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            {/* Navbar */}
            <nav className="sticky top-0 flex justify-between items-center p-2">
                <button
                    type="button"
                    className="btn btn-circle btn-ghost-light"
                    onClick={() => { 
                        onHide();
                        setHighlight(undefined);
                    }}
                >
                    <IoClose className="text-2xl" />
                </button>
            </nav>

            {/* Please consider this condition */}
            <Transition.Child
                className="bg-white min-h-screen p-4 rounded-t-2xl"
                // Enter Animation
                enter="transform duration-1000 transition ease-in-out"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                // Leave Animation
                leave="transform duration-1000 transition ease-in-out"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
            >
                {shape !== undefined ? (
                    <>
                        {/* Preview */}
                        <div className="bg-black rounded-2xl mb-8 overflow-hidden">
                            <ShapePreview
                                shapeCode={shape.code}
                                r={14}
                                t={20}
                                highlight={highlight}
                            />
                        </div>

                        {/* Description */}
                        <div className="text-center mb-8 px-4">
                            <h1 className="text-gray-800 font-medium mb-2">Apa Itu {shape.name}?</h1>
                            <p className="text-gray-600 text-sm">{shape.description}</p>
                        </div>

                        {/* Formula */}
                        <div className="p-4 border border-gray-200 rounded-2xl shadow-sm shadow-blue-800/10">
                            <div className="grid grid-cols-3 items-center mb-2">
                                <h2 className="font-medium ml-2">Volume</h2>
                                <input
                                    className="col-span-2 input input-bordered font-mono"
                                    type="text"
                                    value={`V = ${formatFormula(shape.vFormula)}`}
                                    disabled
                                />
                            </div>

                            <div className="mb-2">
                                {mathSymbolCodes.map((mathSymbolCode, i) => {
                                    // Filtering for every symbols, I think this code will have bad performance
                                    const mathSymbol = getMathSymbol(mathSymbolCode);

                                    return (
                                        <Fragment key={i}>
                                            <div className="flex items-center py-1">
                                                <div className="badge badge-primary badge-outline text-xs h-7 w-7 mr-2">
                                                    {mathSymbol.symbol}
                                                </div>
                                                <div className="text-gray-600 text-sm -mb-px">
                                                    {mathSymbol.title}
                                                </div>
                                                {mathSymbolCode === 'pi' ? (
                                                    <div className="text-gray-600 text-sm my-3 mr-3 ml-auto">
                                                        {/* The Pi value is hard-coded, maybe it can be improved */}
                                                        3.14159...
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className={
                                                            'btn btn-square text-gray-300 ml-auto ' +
                                                            (highlight === mathSymbolCode ? 'btn-ghost-primary' : 'btn-ghost')
                                                        }
                                                        onClick={() => setHighlight(highlight === mathSymbolCode ? undefined : mathSymbolCode)}
                                                    >
                                                        <MdRemoveRedEye className="text-2xl" />
                                                    </button>
                                                )}
                                            </div>
                                            {i + 1 < mathSymbolCodes.length && (<hr className="border-gray-200" />)}
                                        </Fragment>
                                    );
                                })}
                            </div>

                            <Link href={`/initiation/${shapeCode}`}>
                                <button type="button" className="btn btn-primary btn-block">
                                    Pelajari Volume
                                </button>
                            </Link>
                        </div>
                    </>
                ) : null}
            </Transition.Child>
        </Transition >
    );
};

export default ShapeInformation;