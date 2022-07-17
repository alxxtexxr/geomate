import { cloneElement, useRef } from 'react';
import * as THREE from 'three';
import {
    useHitTest,
    ARCanvas,
} from '@react-three/xr';
import { IoArrowBackOutline } from 'react-icons/io5';

// Components
import Overlay from './Overlay';
import Shape from './Shape';

// Types
import type { ShapeCode } from '@prisma/client';

type CanvasInnerProps = {
    shapeCode: ShapeCode, 
    r: number, 
    t: number, 
    baseA: number, 
    baseT: number, 
    baseS: number, 
    wireframe: boolean,
};

const SIZE_DIVIDER = 100;

const CanvasInner = ({ shapeCode, r, t, baseA, baseT, baseS, wireframe }: CanvasInnerProps) => {
    const childrenRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]> | null>(null);

    useHitTest((hit) => {
        if (childrenRef.current) {
            hit.decompose(
                childrenRef.current.position,
                new THREE.Quaternion().setFromEuler(childrenRef.current.rotation),
                childrenRef.current.scale
            );
        }
    });

    return (
        <>
            <hemisphereLight
                args={['#FFFFFF', '#BBBBFF', 1]}
                position={[0.5, 1, 0.25]}
            />

            <Shape
                code={shapeCode}
                r={r / SIZE_DIVIDER}
                t={t / SIZE_DIVIDER}
                baseA={baseA / SIZE_DIVIDER}
                baseT={baseT / SIZE_DIVIDER}
                baseS={baseS / SIZE_DIVIDER}
                wireframe={wireframe}
            />
        </>
    );
};

type Props = CanvasInnerProps & {
    onClose: () => void,
};

const ARLivePreview = ({ onClose, ...canvasInnerProps }: Props) => (
    <Overlay.Black>
        <button className="btn btn-circle btn-ghost absolute z-10 left-2 top-2" onClick={onClose}>
            <IoArrowBackOutline className="text-2xl" />
        </button>
        <div className="relative z-10 px-8">
            <p className="mb-4">Petunjuk cara melihat model 3D bentuk di dunia nyata menggunakan AR:</p>
            <ol className="grid grid-cols-1 gap-4">
                {[
                    'Tekan tombol di bawah layar untuk mulai menggunakan AR.',
                    'Arahkan kamera ponselmu ke permukaan datar.',
                    'Tunggu sampai terlihat model 3D bentuk di layar.',
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
            style={{ position: 'absolute', opacity: 0 }}
        >
            <CanvasInner {...canvasInnerProps} />
        </ARCanvas>
    </Overlay.Black>
);

export default ARLivePreview;