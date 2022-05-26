import Sheet from 'react-modal-sheet';
import { Link } from 'react-router-dom';
import { HiCheck, HiX } from 'react-icons/hi';

const ClassificationResult = ({ isOpen, setIsOpen, shapeCodename, predictedShape }) => (
    <Sheet
        snapPoints={[128]}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
    >
        <Sheet.Container>
            <Sheet.Header>
                <div className="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-16 h-16 flex justify-center items-center bg-white rounded-full shadow">
                    {predictedShape.codename === shapeCodename ? (
                        <HiCheck className="text-primary text-3xl" />
                    ) : (
                        <HiX className="text-red-500 text-3xl" />
                    )}
                </div>
            </Sheet.Header>
            <Sheet.Content>
                <div className="flex justify-between pt-12 pb-8 px-8">
                    <div>
                        <h2 className="text-sm">Bangun Ruang</h2>
                        <h1 className="text-lg font-bold leading-none">{predictedShape.name}</h1>
                    </div>
                    <div>
                        {predictedShape.codename === shapeCodename ? (
                            <Link to={`/observation/${shapeCodename}`}>
                                <button className="btn btn-primary">
                                    Observasi
                                </button>
                            </Link>
                        ) : (
                            <button className="btn" disabled>
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

export default ClassificationResult;