import React from 'react';
import * as THREE from 'three';
import {
    useHitTest,
    ARCanvas,
    DefaultXRControllers,
    useXREvent
} from '@react-three/xr';
import { Ring, Circle, Line } from '@react-three/drei';
import { IoArrowBackOutline } from 'react-icons/io5';

// Components
import Dialog from './MeasurementDialog';

const Reticle = React.forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>((props, ref) => (
    <mesh ref={ref}>
        <Ring args={[0.045, 0.05, 32]} rotation={[-Math.PI / 2, 0, 0]} />
        <Circle args={[0.005, 32]} rotation={[-Math.PI / 2, 0, 0]} />
    </mesh>
));
Reticle.displayName = 'Reticle';

type XREventProps = {
    onSelect: () => void,
}

const XREvent = ({ onSelect }: XREventProps) => {
    useXREvent('select', onSelect);

    return null;
};

const matrixToVector = (matrix: THREE.Matrix4) => {
    const vector = new THREE.Vector3();
    vector.setFromMatrixPosition(matrix);
    return vector;
};

const getDistance = (points: THREE.Vector3[]) => {
    return (points.length === 2) ? points[0].distanceTo(points[1]) : 0;
};

const getCenterPoint = (points: THREE.Vector3[]) => {
    const [[x1, y1, z1], [x2, y2, z2]] = points.map((point) => point.toArray());
    return [(x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2];
};

type CanvasInnerProps = {
    onSubmit: (distance: number) => void,
}

const CanvasInner = ({ onSubmit }: CanvasInnerProps) => {
    const reticleRef = React.createRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>();
    const [lineStart, setLineStart] = React.useState<THREE.Vector3 | null>(null);
    const [lineEnd, setLineEnd] = React.useState<THREE.Vector3 | null>(null);
    const [measurements, setMeasurements] = React.useState<(THREE.Vector3 | null)[][]>([]);

    useHitTest((hit) => {
        if (reticleRef.current) {
            hit.decompose(
                reticleRef.current.position,
                new THREE.Quaternion().setFromEuler(reticleRef.current.rotation),
                reticleRef.current.scale
            );

            const lastMeasurement = measurements[measurements.length - 1];

            if (lineStart && !lastMeasurement[1]) {
                setLineEnd(matrixToVector(reticleRef.current.matrix));
            }
        }
    });

    const handleReset = () => setMeasurements([]);

    const handleSelect = () => {
        if (reticleRef.current) {
            const vector = matrixToVector(reticleRef.current.matrix);

            if (lineStart && lineEnd) {
                setMeasurements((_measurements) => {
                    const [
                        lastMeasurement,
                        ...restMeasurements
                    ] = _measurements.reverse();
                    const updatedLastMeasurement = [lastMeasurement[0], vector];

                    return [...restMeasurements, updatedLastMeasurement];
                });
                setLineStart(null);
                setLineEnd(null);
                // Change else if to else, to measure multiple lines
            } else if (!measurements.length) {
                setLineStart(vector);
                setLineEnd(vector);
                setMeasurements((_measurements) => [..._measurements, [vector, null]]);
            }
        }
    };

    const filterMeasurements = <T,>(measurement: (T | null)[]): measurement is T[] => {
        return measurement.every((point) => point);
    };

    return (
        <>
            <hemisphereLight
                args={['#FFFFFF', '#BBBBFF', 1]}
                position={[0.5, 1, 0.25]}
            />

            <Reticle ref={reticleRef} />

            {lineStart && lineEnd && (
                <Line points={[lineStart, lineEnd]} color="#FFFFFF" lineWidth={2} />
            )}

            {measurements
                .filter(filterMeasurements)
                .map((measurement, i) => {
                    const distance = Math.round(getDistance(measurement) * 100);
                    const [x, y, z] = getCenterPoint(measurement);

                    return (
                        <mesh key={i}>
                            <Dialog
                                messages={["Measurement:", distance + " cm"]}
                                position={[x, y + 0.05, z]}
                                onConfirm={() => onSubmit(distance)}
                                confirmText="OK"
                                onCancel={handleReset}
                                cancelText="RESET"
                            />
                            <Line points={measurement} color="#FFFFFF" lineWidth={2} />
                        </mesh>
                    );
                })}

            <XREvent onSelect={handleSelect} />
            <DefaultXRControllers />
        </>
    );
};

type Props = {
    onSubmit: (distance: number) => void,
    onClose: () => void,
};

const Measurement = ({ onSubmit, onClose }: Props) => (
    <div className="fixed z-20 inset-0 flex justify-center items-center w-screen h-screen bg-black bg-opacity-90 text-gray-300 text-sm">
        <button className="btn btn-circle btn-ghost absolute z-10 left-2 top-2" onClick={onClose}>
            <IoArrowBackOutline className="text-2xl" />
        </button>
        <div className="relative z-10 px-8">
            <p className="mb-4">Petunjuk cara mengukur menggunakan kamera:</p>
            <ol className="grid grid-cols-1 gap-4">
                {[
                    'Tekan tombol di bawah layar untuk mulai mengukur menggunakan kamera.',
                    'Arahkan kamera ponselmu ke sekitar ruangan sampai terlihat tanda ⦿ di layar.',
                    'Ketuk layar untuk menandai titik awal pengukuran.',
                    'Ketuk lagi untuk menandai titik akhir pengukuran.',
                ].map((v, i) => (
                    <li key={i}>
                        <div className="table-cell align-top pt-1 pr-4">
                            <span className="badge w-8 h-8 bg-white text-gray-800 font-bold">
                                {i + 1}
                            </span>
                        </div>
                        <div className="table-cell">
                            {v}
                        </div>
                    </li>
                ))}
            </ol >
        </div>

        <ARCanvas
            camera={{
                fov: 70,
                near: 0.01,
                far: 20
            }}
            sessionInit={{ requiredFeatures: ['hit-test'] }}
            style={{ position: 'absolute', width: '100vw', height: '100vh' }}
        >
            <CanvasInner onSubmit={onSubmit} />
        </ARCanvas>
    </div >
);

export default Measurement;