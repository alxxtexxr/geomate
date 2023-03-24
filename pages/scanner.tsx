import { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { HiCamera } from 'react-icons/hi';
import * as tmImage from '@teachablemachine/image';

// Components
import Loading from '../components/Loading';
import ShapeInformation from '../components/ShapeInformation';

// Utils
import { createImgElemement } from '../Utils';

// Types
import type ComponentWithAuth from '../types/ComponentWithAuth';
import type { ShapeCode } from '@prisma/client';

const Classification: ComponentWithAuth = () => {
    // Constants
    const MODEL_URL = '/models/3d-shape-classification-model/model.json';
    const METADATA_URL = '/models/3d-shape-classification-model/metadata.json';

    // Refs
    const webcamRef = useRef<Webcam | null>(null);

    // States
    const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [predictedShapeCode, setPredictedShapeCode] = useState<ShapeCode| null>(null);
    const [isShapeInformationShowing, setIsShapeInformationShowing] = useState(false);

    // Effects 
    useEffect(() => {
        tmImage.load(MODEL_URL, METADATA_URL)
            .then((model) => setModel(model));
    }, []);

    const capture = useCallback(async () => {
        if (!model) { return; }

        setIsLoading(true);

        const _base64Image = webcamRef?.current && webcamRef.current.getScreenshot();
        const imgElemement = _base64Image ? await createImgElemement(_base64Image) : null;
        const prediction = imgElemement ? await model.predict(imgElemement) : null;
        const maxPrediction = prediction ? prediction.reduce((prev, current) => {
            return (prev.probability > current.probability) ? prev : current
        }) : null;
        const _predictedShapeCode = maxPrediction?.className;

        setPredictedShapeCode(_predictedShapeCode as ShapeCode);
        setIsShapeInformationShowing(true);
    }, [webcamRef, model]);

    return (
        <main className="relative bg-black w-inherit h-screen">
            {model === null && (
                <div className="fixed z-10 flex justify-center items-center bg-black bg-opacity-95 text-white h-screen w-inherit">
                    <Loading.Spinner />
                </div>
            )}

            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 360,
                    height: 480,
                    facingMode: 'environment',
                    aspectRatio: 0.5,
                }}
                className="w-inherit h-screen"
            />

            <section className="fixed bottom-0 w-inherit text-center p-8">
                {isLoading ? (
                    <div className="inline-flex bg-white rounded-full">
                        <button
                            className="btn btn-lg btn-circle"
                            disabled
                        >
                            <Loading.Spinner />
                        </button>
                    </div>
                ) : (
                    <button
                        className="bg-white hover:bg-white text-primary border-white hover:border-white btn btn-lg btn-circle"
                        onClick={() => capture()}
                    >
                        <HiCamera className="text-3xl" />
                    </button>
                )}
            </section>

            {/* Result */}
            {predictedShapeCode && (
                <ShapeInformation
                    shapeCode={predictedShapeCode}
                    isShowing={isShapeInformationShowing}
                    setIsShowing={setIsShapeInformationShowing}
                    onHide={() => {
                        setPredictedShapeCode(null);
                        setIsLoading(false);
                    }}
                />
            )}
        </main>
    );
};

Classification.auth = true;

export default Classification;