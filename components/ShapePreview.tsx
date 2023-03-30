import { useState, Fragment } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Plane, Line } from '@react-three/drei';
// import { HiOutlineCube } from 'react-icons/hi';

// Components
import ShapeComponent from './Shape/index';
import Swap from './Swap';
import ARLivePreview from '../components/ARLivePreview';

// Constants
import { SHAPE_PREVIEW_DEFAULT_HEIGHT } from '../Constants';

// Types
import type { ShapeCode } from '@prisma/client';

type Props = {
    shapeCode: ShapeCode,
    r: number,
    t: number,
    n?: number,
    color?: string,
    highlight?: string,
    height?: number,
};

const ShapePreview = ({
    shapeCode,
    r,
    t,
    n = 1,
    color,
    highlight,
    height = SHAPE_PREVIEW_DEFAULT_HEIGHT,
}: Props) => {
    // const [wireframe, setWireframe] = useState(false);
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
                    <fog args={['#000', 125, 250]} attach="fog" />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[1, 3, 1]} intensity={1.0} />
                    <PerspectiveCamera makeDefault position={[0, 30, 100]} fov={30} />
                    <OrbitControls autoRotate target={[0, 14, 0]} />

                    {[...Array(n).keys()].map((i) => {
                        const GAP_SIZE = 1;
                        const isEven = n % 2 === 0;
                        const halfN = n / 2;

                        let x = i - Math.floor(halfN);
                        x += isEven ? 0.5 : 0;
                        x *= (r + GAP_SIZE / 2) * 2;

                        let y1 = 0
                        let y2 = 0
                        let z2 = 0;

                        if (shapeCode === 'sphere') { y1 = r; y2 = r; }
                        if (highlight === 't') { y2 = t; }
                        if (highlight === 'r') { z2 = r; }

                        return (
                            <Fragment key={i}>
                                <ShapeComponent
                                    code={shapeCode}
                                    r={r}
                                    t={t}
                                    x={x}
                                    { ...(highlight && { opacity: 0.5 })}
                                    { ...(color && { color: color })}
                                />
                                <Line
                                    points={[[0, y1, 0], [0, y2, z2]]}
                                    lineWidth={5}
                                    color="red"
                                />
                            </Fragment>
                        )
                    })}

                    <Plane args={[250, 250, 10, 10]} rotation={[-Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#888888" wireframe />
                    </Plane>
                </Canvas>

                <div className="absolute bottom-0 right-0 grid grid-cols-1 gap-2 p-4">
                    {/* <Swap isActive={wireframe} onClick={() => setWireframe(!wireframe)}>
                        <HiOutlineCube className="text-2xl" />
                    </Swap> */}
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
                />
            )}
        </>
    );
};

export default ShapePreview;