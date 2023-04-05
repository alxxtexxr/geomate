import { Fragment, useState } from 'react';
import Link from 'next/link';
// import { Transition } from '@headlessui/react';
import Sheet from 'react-modal-sheet';
import { MdRemoveRedEye } from 'react-icons/md';
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
    const mathSymbolCodes = shape !== undefined ? extractMathSymbolCodes(shape.vFormula, true) : [];

    // State
    const [highlight, setHighlight] = useState<string>();

    // Function
    const _onHide = () => {
        onHide();
        setHighlight(undefined);
    };

    return (
        <Sheet
            snapPoints={[-1]}
            isOpen={isShowing}
            onClose={_onHide}
        >
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                    <div className="px-4">
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
                                <div className="text-center mb-14 px-4">
                                    <h1 className="text-gray-800 font-medium mb-2">Apa itu {shape.name}?</h1>
                                    <p className="text-gray-600 text-sm">{shape.description}</p>
                                </div>

                                {/* Formula */}
                                <div className="relative border border-gray-300 rounded-2xl shadow-sm shadow-blue-800/10">
                                    <div className="absolute flex justify-center transform -translate-y-1/2 w-full">
                                        {/* {shape.vFormulaUndiscovered} */}
                                        <Formula formula={shape.vFormulaUndiscovered}/>
                                        {/* <div
                                            className="inline-flex text-lg mx-0.5 py-4 px-8 border rounded-full bg-white text-gray-800 border-gray-300"
                                            dangerouslySetInnerHTML={{
                                                __html: katex.renderToString('V_{tabung} = ' + formatFormulaToKatex(shape.vFormula))
                                            }}
                                        /> */}
                                    </div>

                                    <div className="pt-8 px-4">
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

                                    <div className="pt-2 px-4 pb-4">
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