import Sheet from 'react-modal-sheet';
import { HiCheck, HiX } from 'react-icons/hi';

// Components
import LoadingButton from './Loading/LoadingButton';

// Types
import { Dispatch, SetStateAction } from 'react';
import type Shape from '../types/Shape';

type Props = {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    shape: Shape,
    predictedShape: Shape,
    isSubmitting: boolean,
    onSubmit: () => {},
};

const ClassificationResult = ({ isOpen, setIsOpen, shape, predictedShape, isSubmitting, onSubmit }: Props) => {
    const isCorrect = shape.code === predictedShape.code;

    return (
        <Sheet
            snapPoints={[224]}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <Sheet.Container>
                <Sheet.Header>
                    <div className="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-16 h-16 flex justify-center items-center bg-white rounded-full shadow">
                        {isCorrect ? (
                            <HiCheck className="text-primary text-3xl" />
                        ) : (
                            <HiX className="text-red-500 text-3xl" />
                        )}
                    </div>
                </Sheet.Header>
                <Sheet.Content>
                    <div className="text-center pt-14 pb-4 px-4">
                        <div className="px-4 mb-8">
                            <h1 className={
                                'font-medium mb-2' +
                                (isCorrect ? ' text-primary' : ' text-red-500')
                            }>
                                {predictedShape.name}
                            </h1>
                            <p className="text-gray-600 text-sm">
                                {isCorrect ? (
                                    <>
                                        Benar! Objek yang kamu scan termasuk bangun ruang <span className="font-medium">{shape.name}</span>.
                                    </>
                                ) : (
                                    <>
                                        Belum benar, objek yang kamu scan bukan termasuk bangun ruang <span className="font-medium">{shape.name}</span>.
                                    </>
                                )}

                            </p>
                        </div>
                        <div>
                            {predictedShape.code === shape.code ? (
                                isSubmitting ? (
                                    <LoadingButton />
                                ) : (
                                    <button className="btn btn-primary w-full" onClick={onSubmit}>
                                        Observasi
                                    </button>
                                )
                            ) : (
                                <button className="btn w-full" disabled>
                                    Observasi
                                </button>
                            )}
                        </div>
                    </div>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => setIsOpen(false)} />
        </Sheet >
    );
};

export default ClassificationResult;