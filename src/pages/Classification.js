import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Sheet from 'react-modal-sheet';
import { HiCamera, HiCheck, HiLo } from 'react-icons/hi';
import Webcam from 'react-webcam';

import { SHAPES } from '../Constants';

const videoConstraints = {
    width: 360,
    height: 720,
    facingMode: 'user',
};

const Classification = () => {
    const [isOpen, setOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    // Get selected shape
    let { shapeCodename } = useParams();
    const shape = SHAPES.filter((SHAPE) => SHAPE.codename === shapeCodename)[0];

    return (
        <main className="relative bg-black h-screen">
            <Webcam
                audio={false}
                // height={720}
                screenshotFormat="image/jpeg"
                // width={1280}
                videoConstraints={videoConstraints}
                className="w-screen h-screen"
            >
                {({ getScreenshot }) => (
                    <section className="fixed bottom-0 w-screen text-center p-8">
                        <button
                            className="bg-base-100 hover:bg-base-200 text-primary border-white btn btn-lg btn-circle"
                            onClick={() => {
                                setLoading(true);

                                const imageSrc = getScreenshot()

                                console.log(imageSrc)

                                setOpen(true);
                                setLoading(false);
                            }}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <HiCamera className="text-3xl" />
                            )}
                        </button>
                    </section>
                )}
            </Webcam>



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
        </main>
    );
};

export default Classification;