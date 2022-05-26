import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import Webcam from 'react-webcam';
import { HiCamera } from 'react-icons/hi';

import ClassificationResult from '../components/ClassificationResult';

import { SHAPES } from '../Constants';

const Classification = () => {
    let { shapeCodename } = useParams();

    // States
    const [model, setModel] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [predictedShape, setPredictedShape] = useState(null);

    // Effects 
    useEffect(() => {
        // Load 3D Shape Classification model
        loadGraphModel('/models/3d-shape-classification-model/model.json')
            .then((model) => setModel(model))
            .catch((err) => console.error(err));
    }, []);

    // Functions
    function createImgElem(imgSrc) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous';
            img.src = imgSrc;
            img.onload = () => resolve(img);
        })
    };

    const predict = (pixels) => {
        // Preprocessing the image
        let image = tf.browser.fromPixels(pixels);
        image = tf.image.resizeBilinear(image, [224, 224]);
        image = tf.cast(image, 'float32');
        image = tf.tensor4d(Array.from(image.dataSync()), [1, 224, 224, 3])

        return model.predict(image, { batchSize: 32 }).data();
    };

    const capture = async (getScreenshot) => {
        setIsLoading(true);

        const imgSrc = getScreenshot()
        const imgElem = await createImgElem(imgSrc).catch((err) => console.log(err));
        const predictions = await predict(imgElem).catch((err) => console.log(err));
        const predictedI = predictions.indexOf(Math.max(...predictions));

        if (predictedI > -1) {
            setPredictedShape(SHAPES[predictedI]);
            setIsOpen(true);
            setIsLoading(false);
        }
    };

    return (
        <main className="relative bg-black h-screen">
            <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 360,
                    height: 720,
                    facingMode: 'user',
                }}
                className="w-screen h-screen"
            >
                {({ getScreenshot }) => (
                    <section className="fixed bottom-0 w-screen text-center p-8">
                        <button
                            className="bg-base-100 hover:bg-base-200 text-primary border-white btn btn-lg btn-circle"
                            onClick={() => capture(getScreenshot)}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <HiCamera className="text-3xl" />
                            )}
                        </button>
                    </section>
                )}
            </Webcam>

            {/* Result */}
            {predictedShape && (
                <ClassificationResult
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    predictedShape={predictedShape}
                    shapeCodename={shapeCodename}
                />
            )}
        </main>
    );
};

export default Classification;