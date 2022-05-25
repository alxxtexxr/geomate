import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Sheet from 'react-modal-sheet';
import { HiCamera, HiCheck } from 'react-icons/hi';

import { SHAPES } from '../Constants';

const Classification = () => {
    const [isOpen, setOpen] = React.useState(false);

    // Get selected shape
    let { shapeCodename } = useParams();
    const shape = SHAPES.filter((SHAPE) => SHAPE.codename === shapeCodename)[0];

    return (
        <main className="relative bg-neutral h-screen">
            <section className="fixed bottom-0 w-screen text-center p-8">
                <button className="bg-base-100 hover:bg-base-200 text-primary border-white btn btn-lg btn-circle" onClick={() => setOpen(true)}>
                    <HiCamera className="text-3xl" />
                </button>

                <Sheet
                    snapPoints={[128]}
                    isOpen={isOpen}
                    onClose={() => setOpen(false)}
                >
                    <Sheet.Container>
                        <Sheet.Header>
                            <div className="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-16 h-16 flex justify-center items-center bg-white rounded-full shadow">
                                <HiCheck className="text-primary text-3xl" />
                            </div>
                        </Sheet.Header>
                        <Sheet.Content>
                            <div className="flex justify-between pt-12 pb-8 px-8">
                                <div>
                                    <h2 className="text-sm">Bangun Ruang</h2>
                                    <h1 className="text-lg font-bold leading-none">{shape.name}</h1>
                                </div>
                                <div>
                                    <Link to={`/observation/${shapeCodename}`}>
                                        <button className="btn btn-primary">
                                            Observasi
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop onClick={() => setOpen(false)} />
                </Sheet>
            </section>
        </main>
    );
};

export default Classification;