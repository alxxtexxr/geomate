import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Plane } from '@react-three/drei';
import { HiOutlineCube } from 'react-icons/hi';

// Components
import ShapeComponent from './Shape/index';
import Swap from './Swap';
import ARLivePreview from '../components/ARLivePreview';

// Types
import type { ShapeCode } from '@prisma/client';
import type ObservationForm from '../types/ObservationForm';

type Props = {
    shapeCode: ShapeCode,
    r: number,
    t: number,
    height?: number
};

const ShapePreview = ({ shapeCode, r, t, height = 272 }: Props) => {
    const [wireframe, setWireframe] = useState(false);
    const [isLivePreviewing, setIsLivePreviewing] = useState(false);

    return (
        <>
            <section
                className="sticky top-0 z-0"
                style={{
                    touchAction: 'none',
                    height: height,
                }}
            >
                <Canvas camera={{}}>
                    <fog args={['#000', 2, 250]} attach="fog" />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[1, 3, 1]} intensity={1.0} />
                    <PerspectiveCamera makeDefault position={[0, 30, 100]} fov={30} />
                    <OrbitControls autoRotate target={[0, 8, 0]} />

                    <ShapeComponent
                        code={shapeCode}
                        r={r}
                        t={t}
                        wireframe={wireframe}
                    />

                    <Plane args={[250, 250, 10, 10]} rotation={[-Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#FFFFFF" wireframe />
                    </Plane>
                </Canvas>

                <div className="absolute bottom-0 right-0 grid grid-cols-1 gap-2 p-4">
                    <Swap isActive={wireframe} onClick={() => setWireframe(!wireframe)}>
                        <HiOutlineCube className="text-2xl" />
                    </Swap>
                    <Swap isActive={isLivePreviewing} onClick={() => setIsLivePreviewing(true)}>
                        AR
                    </Swap>
                </div>
            </section>

            {isLivePreviewing && (
                <ARLivePreview
                    onClose={() => setIsLivePreviewing(false)}
                    shapeCode={shapeCode}
                    r={r}
                    t={t}
                    wireframe={wireframe}
                />
            )}
        </>
    );
};

export default ShapePreview;