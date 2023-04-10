import { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';
import { MdClose, MdSettings } from 'react-icons/md';
import Sheet from 'react-modal-sheet';

// Tailwind Config
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig)

// Components
import ShapeInformation from '../components/ShapeInformation';
import Navbar from '../components/Navbar';

// Types
import type ComponentWithAuth from '../types/ComponentWithAuth';
import type { ShapeCode } from '@prisma/client';

type Prediction = {
    box: number[],
    name: ShapeCode,
    score: number,
};

type WindowSize = {
    width: number | undefined;
    height: number | undefined;
}


// const WIDTH = 384;
// const HEIGHT = 288;

// Hook
const useWindowSize = () => {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        const handleResize = () => {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

const Scanner: ComponentWithAuth = () => {
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    // Refs
    const webcamRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // States
    const [deviceId, setDeviceId] = useState('');
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedShapeCode, setSetectedShapeCode] = useState<ShapeCode>();
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    // Functions
    const hideShapeInformation = () => setSetectedShapeCode(undefined);

    const loadDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
        setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'))
    }, [setDevices]);

    const drawBoxes = (predictions: Prediction[]) => {
        if (!canvasRef.current) return
        const ctx = canvasRef.current.getContext('2d');

        if (!ctx) return
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Font options
        ctx.font = 'bold 30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        predictions.forEach((prediction) => {
            // Draw the bounding box
            const x = prediction.box[0];
            const y = prediction.box[1];
            const w = (prediction.box[2] - prediction.box[0]);
            const h = (prediction.box[3] - prediction.box[1]);
            const xCenter = x + (w / 2);
            const yCenter = y + (h / 2);
            const r = 24;

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(xCenter, yCenter, r + 6, 0, 2 * Math.PI, false);
            ctx.stroke()

            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(xCenter, yCenter, r, 0, 2 * Math.PI, false);
            ctx.fill();

            ctx.fillStyle = fullConfig.daisyui.themes[0].mytheme.primary;
            ctx.fillText('?', xCenter, yCenter + 2);
        });

        canvasRef.current.addEventListener("click", function (e) {
            if (!canvasRef.current) return
            const rect = canvasRef.current.getBoundingClientRect();
            const rectX = e.clientX - rect.left;
            const rectY = e.clientY - rect.top;

            predictions.forEach((prediction) => {
                const x = prediction.box[0];
                const y = prediction.box[1];
                const w = (prediction.box[2] - prediction.box[0]);
                const h = (prediction.box[3] - prediction.box[1]);
                const xCenter = x + (w / 2);
                const yCenter = y + (h / 2);
                const r = 24;
                const circleX = xCenter - (r / 2)
                const circleY = yCenter - (r / 2)

                if (rectX >= circleX && rectX <= circleX + r && rectY >= circleY && rectY <= circleY + r) {
                    setSetectedShapeCode(prediction.name);
                }
            });
        });
    }

    const videoFrameToFile = (video: HTMLVideoElement, fileType: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Failed to get canvas context.'));
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Failed to create blob.'));
                    return;
                }

                resolve(blob);
            }, fileType);
        });
    }

    const predict = async () => {
        if (webcamRef.current && webcamRef.current.video) {
            try {
                // Create an image file of the frame
                const file = await videoFrameToFile(webcamRef.current.video, 'image/jpeg');
                // Check image with base64
                // const reader = new FileReader();
                // reader.readAsDataURL(file);
                // reader.onloadend = function () {
                //   var base64data = reader.result;
                //   console.log(base64data);
                // }
                const formData = new FormData();
                formData.append('file', file);

                // Detect the shape of the object in the image with API
                const response = await fetch('http://localhost:8000/detect', {
                    method: 'POST',
                    body: formData
                })
                const data = await response.json()

                // Add delay for 1s to predict again
                setTimeout(() => {
                    if (Array.isArray(data) && data.length) {
                        drawBoxes(data);
                    }
                    predict();
                }, 1000);
            } catch (error) {
                console.error(error)
            };
        }
    };

    // Effect
    useEffect(() => {
        if (devices.length) {
            if (!canvasRef.current) return
            const ctx = canvasRef.current.getContext('2d');

            if (!ctx) return
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            if (!deviceId) {
                // If devices are loaded, set initial device ID
                setDeviceId(devices[0].deviceId);
            }
        } else {
            navigator.mediaDevices.enumerateDevices().then(loadDevices);
        }
    }, [loadDevices, devices, deviceId, webcamRef, canvasRef]);

    return (
        <main className="relative bg-black w-inherit h-screen">
            <div className="fixed z-10 w-inherit bg-black bg-opacity-5">
                <Navbar.Top
                    title="Scanner"
                    leftButton={(
                        <Link href="/">
                            <button type="button" className="btn btn-circle btn-ghost-light">
                                <MdClose className="text-2xl" />
                            </button>
                        </Link>
                    )}
                    rightButton={(
                        <button
                            type="button"
                            className="btn btn-circle btn-ghost-light"
                            onClick={() => setIsSettingOpen(true)}
                        >
                            <MdSettings className="text-2xl" />
                        </button>
                    )}
                    light
                />
            </div>

            <Sheet
                snapPoints={[140]}
                isOpen={isSettingOpen}
                onClose={() => setIsSettingOpen(false)}
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <div className="px-4 pb-4">
                            <div className="form-control w-full">
                                <label className="label text-gray-800 text-sm">
                                    <span className="label-text">Kamera</span>
                                </label>
                                <select
                                    value={deviceId}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                    className="input input-bordered w-full"
                                >
                                    <option>Select a device</option>
                                    {devices.map((device) => (
                                        <option
                                            value={device.deviceId}
                                            key={device.deviceId}
                                        >
                                            {device.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => setIsSettingOpen(false)} />
            </Sheet >

            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: windowWidth,
                    height: windowHeight,
                    deviceId: deviceId,
                }}
                onLoadedMetadata={predict}
            />

            <canvas
                ref={canvasRef}
                width={windowWidth}
                height={windowHeight}
                className="absolute inset-0"
            />

            <ShapeInformation shapeCode={selectedShapeCode} onHide={hideShapeInformation} />
        </main>
    );
};

Scanner.auth = true;

export default Scanner;