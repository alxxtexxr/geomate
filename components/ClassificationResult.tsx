import Sheet from 'react-modal-sheet';
import Link from 'next/link';
import { HiCheck, HiX } from 'react-icons/hi';
import classNames from 'classnames';

// Types
import { Dispatch, SetStateAction } from 'react';
import Shape from '../types/Shape';

type Props = {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    shape: Shape,
    predictedShape: Shape,
}

const ClassificationResult = ({ isOpen, setIsOpen, shape, predictedShape }: Props) => {
    const isCorrect = shape.codename === predictedShape.codename;

    return (
        <Sheet
            snapPoints={[216]}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <Sheet.Container onViewportBoxUpdate>
                <Sheet.Header onViewportBoxUpdate>
                    <div className="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-16 h-16 flex justify-center items-center bg-white rounded-full shadow">
                        {isCorrect ? (
                            <HiCheck className="text-primary text-3xl" />
                        ) : (
                            <HiX className="text-red-500 text-3xl" />
                        )}
                    </div>
                </Sheet.Header>
                <Sheet.Content onViewportBoxUpdate>
                    <div className="text-center pt-14 pb-4 px-4">
                        <div className="px-8 mb-8">
                            <h1 className={classNames('font-bold leading-none mb-2', {
                                ['text-primary']: isCorrect,
                                ['text-red-500']: !isCorrect,
                            })}>
                                {predictedShape.name}
                            </h1>
                            <h2 className="text-sm">
                                {isCorrect ? (
                                    <>
                                        Benar! Objek yang kamu scan termasuk bangun ruang <strong>{shape.name}</strong>.
                                    </>
                                ) : (
                                    <>
                                        Belum benar, objek yang kamu scan bukan termasuk bangun ruang <strong>{shape.name}</strong>.
                                    </>
                                )}

                            </h2>
                        </div>
                        <div>
                            {predictedShape.codename === shape.codename ? (
                                <Link href={`/observation/${shape.codename}`}>
                                    <button className="btn btn-primary w-full">
                                        Observasi
                                    </button>
                                </Link>
                            ) : (
                                <button className="btn w-full" disabled>
                                    Observasi
                                </button>
                            )}
                        </div>
                    </div>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onViewportBoxUpdate onTap={() => setIsOpen(false)} />
        </Sheet>
    );
};

export default ClassificationResult;