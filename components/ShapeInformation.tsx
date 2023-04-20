import { Fragment, useState } from 'react';
import Link from 'next/link';
// import { Transition } from '@headlessui/react';
import Sheet from 'react-modal-sheet';
import { MdClose, MdRemoveRedEye } from 'react-icons/md';
import katex from 'katex';

// Component
import ShapePreview from './ShapePreview';
import Formula from './Formula';

// Util
import { getShape, formatFormula, extractMathSymbolCodes, getMathSymbol, formatFormulaToKatex } from '../Utils';

// Types
import type { ShapeCode } from '@prisma/client';

type Props = {
    shapeCode?: ShapeCode,
    onHide: () => void,
};

const ShapeInformation = ({ shapeCode, onHide }: Props) => {
    const shape = shapeCode && getShape(shapeCode);
    const isShowing = !!shapeCode;
    const mathSymbolCodes = shape !== undefined && shape.vFormulaUndiscoveredMathSymbols !== undefined
        ? shape.vFormulaUndiscoveredMathSymbols
        : [];

    // State
    const [highlight, setHighlight] = useState<string>();

    // Function
    const _onHide = () => {
        onHide();
        setHighlight(undefined);
    };

    return (
        <Sheet
            isOpen={isShowing}
            onClose={_onHide}
            disableDrag
            className="w-full sm:w-96"
            style={{ zIndex: 90, left: '50%', transform: 'translateX(-50%)' }}
        >
            <Sheet.Container>
                {/* <Sheet.Header>
                    <div className="p-2">
                        <button className="btn btn-ghost">
                            <MdClose className="text-2xl" />
                        </button>
                    </div>
                </Sheet.Header> */}
                <Sheet.Content>
                    <div className="p-4">
                        {shape !== undefined ? (
                            <>
                                {/* Preview */}
                                <div className="relative bg-black rounded-xl mb-8 overflow-hidden">
                                    <ShapePreview
                                        shapeCode={shape.code}
                                        r={14}
                                        t={20}
                                        highlight={highlight}
                                    />
                                </div>

                                {/* Description */}
                                <div className="text-center px-4">
                                    <h1 className="text-gray-800 font-medium mb-2">Apa itu {shape.name}?</h1>
                                    <p className="text-gray-600 text-sm">{shape.description}</p>
                                </div>

                                {/* Formula */}
                                <div className="relative mt-16 p-4 border border-gray-300 rounded-2xl shadow-sm shadow-blue-800/10">
                                    <div className="text-center -mt-12">
                                        <Formula formula={shape.vFormulaUndiscovered} className="mt-0.5" />
                                    </div>

                                    <div className="">
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
                                                            {shape.code === 'cylinder' ? mathSymbol.title : mathSymbol.title.replaceAll('Alas', 'Lingkaran')}
                                                        </div>
                                                        {mathSymbolCode === 'pi' ? (
                                                            <div className="text-gray-800 font-mono my-3 mr-3 ml-auto">
                                                                {/* The Pi value is hard-coded, maybe it can be improved */}
                                                                3.1415...
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className={
                                                                    'btn btn-square ml-auto ' +
                                                                    (highlight === mathSymbolCode ? 'btn-ghost-primary' : 'btn-toggle')
                                                                }
                                                                onClick={() => setHighlight(highlight === mathSymbolCode ? undefined : mathSymbolCode)}
                                                            >
                                                                <MdRemoveRedEye className="text-2xl" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {i + 1 < mathSymbolCodes.length && (<hr className="border-gray-300" />)}
                                                </Fragment>
                                            );
                                        })}
                                    </div>

                                    <div className="">
                                        <Link href={`/introduction/${shapeCode}`}>
                                            <button type="button" className="btn btn-primary btn-block">
                                                Pelajari Volume
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={_onHide} />
        </Sheet >
    );
};

export default ShapeInformation;