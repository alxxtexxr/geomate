import Sheet from 'react-modal-sheet';
import { Link, useParams } from 'react-router-dom';
import { HiCheck, HiX } from 'react-icons/hi';

import { SHAPES } from '../Constants';
import { getShape } from '../Utils';
import classNames from 'classnames';

const ClassificationResult = ({ isOpen, setIsOpen, predictions }) => {
    let { shapeCodename } = useParams();
    const shape = getShape(shapeCodename);

    const maxPrediction = Math.max(...predictions);
    const maxPredictionI = predictions.indexOf(maxPrediction);

    const predictedShape = SHAPES[maxPredictionI];

    const isCorrect = predictedShape.codename === shapeCodename;

    return (
        <Sheet
            snapPoints={[216]}
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
                        <div className="px-8 mb-8">
                            <h1 className={classNames('font-bold leading-none mb-2', {
                                ['text-primary']: isCorrect,
                                ['text-red-500']: !isCorrect,
                            })}>
                                {~~(maxPrediction * 100)}% {predictedShape.name}
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
                            {predictedShape.codename === shapeCodename ? (
                                <Link to={`/observation/${shapeCodename}`}>
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
            <Sheet.Backdrop onClick={() => setIsOpen(false)} />
        </Sheet>
    );
};

export default ClassificationResult;