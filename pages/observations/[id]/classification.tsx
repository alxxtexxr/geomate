import { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { HiCamera } from 'react-icons/hi';
import Router from 'next/router';
import * as tmImage from '@teachablemachine/image';

// Components
import ClassificationResult from '../../../components/ClassificationResult';
import Spinner from '../../../components/Spinner';

// Utils
import { createImgElemement, dataURItoBlob, getShapeByCode } from '../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../types/ComponentWithAuth';
import type Shape from '../../../types/Shape';
import type { Observation } from '@prisma/client';

type Props = {
    observation: Observation,
    shape: Shape,
};

const Classification: ComponentWithAuth<Props> = ({ observation, shape }) => {
    // Constants
    const MODEL_URL = '/models/3d-shape-classification-model/model.json';
    const METADATA_URL = '/models/3d-shape-classification-model/metadata.json';

    // Refs
    const webcamRef = useRef<Webcam | null>(null);

    // States
    const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [predictedShape, setPredictedShape] = useState<Shape | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Effects 
    useEffect(() => {
        tmImage.load(MODEL_URL, METADATA_URL)
            .then((model) => setModel(model));
    }, []);

    const capture = useCallback(async () => {
        if (!model) { return; }

        setIsLoading(true);

        // Predicting the object shape
        const _base64Image = webcamRef?.current && webcamRef.current.getScreenshot();

        setBase64Image(_base64Image);

        const imgElemement = _base64Image ? await createImgElemement(_base64Image) : null;
        const prediction = imgElemement ? await model.predict(imgElemement) : null;
        // Get the max. probability of predictions
        const maxPrediction = prediction ? prediction.reduce(function(prev, current) {
            return (prev.probability > current.probability) ? prev : current
        }) : null;
        const predictedShape = maxPrediction ? getShapeByCode(maxPrediction.className) : null;

        setPredictedShape(predictedShape);
        setIsOpen(true);
        setIsLoading(false);
    }, [webcamRef, model]);

    const handleSubmit = async () => {
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

            await Router.push(`/observations/${observation.id}/mensuration`);
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
        }
    }

    return (
        <main className="relative bg-black h-screen">
            {model === null && (
                <div className="fixed z-10 flex justify-center items-center bg-black bg-opacity-95 text-white h-screen w-screen ">
                    <Spinner />
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
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
        </main>
    );
};

Classification.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers;
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/observations/${id}`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const observation = await res.json();
    const shape = getShapeByCode(observation.shapeCode);

    return { props: { observation, shape } };
};

export default Classification;