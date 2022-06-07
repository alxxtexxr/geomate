import { useRef, useCallback, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import Webcam from 'react-webcam';
import { HiCamera } from 'react-icons/hi';
import Router from 'next/router';

// Components
import ClassificationResult from '../../../components/ClassificationResult';
import Spinner from '../../../components/Spinner';

// Utils
import { createImgElemement, dataURItoBlob, getShapeByCodename, getShapeByI } from '../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../types/ComponentWithAuth';
import type Shape from '../../../types/Shape';
import type Observation from '../../../types/Observation';

type Props = {
    observation: Observation,
    shape: Shape,
};

const Classification: ComponentWithAuth<Props> = ({ observation, shape }) => {
    // Refs
    const webcamRef = useRef<Webcam | null>(null);

    // States
    const [model, setModel] = useState<tf.GraphModel<string | tf.io.IOHandler> | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [predictedShape, setPredictedShape] = useState<Shape | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Effects 
    useEffect(() => {
        // Load 3D Shape Classification model
        loadGraphModel('/models/3d-shape-classification-model/model.json')
            .then((model) => setModel(model))
            .catch((err) => console.error(err));
    }, []);

    // Functions
    const predict = (pixels: HTMLImageElement | HTMLVideoElement | tf.PixelData | ImageData | HTMLCanvasElement | ImageBitmap): Promise<Uint8Array | Float32Array | Int32Array> | null => {
        if (!model) { return null; }

        // Preprocessing the image
        let imgTf3d = tf.browser.fromPixels(pixels);
        imgTf3d = tf.image.resizeBilinear(imgTf3d, [224, 224]);
        imgTf3d = tf.cast(imgTf3d, 'float32');
        const imgTf4d = tf.tensor4d(Array.from(imgTf3d.dataSync()), [1, 224, 224, 3])

        return (model.predict(imgTf4d, { batchSize: 32 }) as tf.Tensor).data();
    };

    const capture = useCallback(async () => {
        setIsLoading(true);

        // Predicting the object shape
        const _base64Image = webcamRef?.current && webcamRef.current.getScreenshot();

        setBase64Image(_base64Image);

        const imgElemement = _base64Image ? await createImgElemement(_base64Image) : null;
        const predictions = imgElemement ? await predict(imgElemement) : null;
        const maxPrediction = predictions ? Math.max(...Array.from(predictions)) : null;
        const maxPredictionI = predictions && maxPrediction ? predictions.indexOf(maxPrediction) : null;
        const predictedShape = maxPredictionI ? getShapeByI(maxPredictionI) : null;

        setPredictedShape(predictedShape);
        setIsOpen(true);
        setIsLoading(false);
    }, [webcamRef, model]);

    const onSubmit = async () => {
        setIsSubmitting(true);

        if (!base64Image) {
            setIsSubmitting(false);
            return false;
        }

        try {
            const image = dataURItoBlob(base64Image);
            const formData = new FormData();

            formData.append('image', image);

            await fetch(`/api/observations/${observation.id}/image`, {
                method: 'PUT',
                body: formData,
            });

            setIsSubmitting(false);
            await Router.push(`/observations/${observation.id}/calculation`);
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
        }
    }

    return (
        <main className="relative bg-black h-screen">
            {model === null && (
                <div className="fixed z-10 flex justify-center items-center bg-black bg-opacity-60 text-white h-screen w-screen ">
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}

            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 360,
                    height: 720,
                    facingMode: 'user',
                }}
                className="w-screen h-screen"
            />

            <section className="fixed bottom-0 w-screen text-center p-8">
                {isLoading ? (
                    <div className="inline-flex bg-white rounded-full">
                        <button
                            className="btn btn-lg btn-circle"
                            disabled
                        >
                            <Spinner />
                        </button>
                    </div>
                ) : (
                    <button
                        className="bg-base-100 hover:bg-base-200 text-primary border-white hover:border-white btn btn-lg btn-circle"
                        onClick={() => capture()}
                    >
                        <HiCamera className="text-3xl" />
                    </button>
                )}
            </section>

            {/* Result */}
            {predictedShape && (
                <ClassificationResult
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    shape={shape}
                    predictedShape={predictedShape}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
        </main>
    );
};

Classification.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/observations/${id}`);
    const observation = await res.json();
    const shape = getShapeByCodename(observation.shapeCodename);

    return { props: { observation, shape } };
};

export default Classification;