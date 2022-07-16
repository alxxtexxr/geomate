import { forwardRef } from 'react';
import * as THREE from 'three';
import { animated } from '@react-spring/three';
import { Cylinder } from '@react-three/drei';

// Types
export type Props = {
    r: number,
    t: number,
    nBaseVertices: number,
    baseA?: number,
    baseT?: number,
    baseS?: number,
    wireframe?: boolean
};

const Prism = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ r, t, nBaseVertices, baseA, baseT, baseS, wireframe = false }, ref) => {
    const rList: { [key: number]: number } = {
        3: baseA && baseT ? Math.sqrt(Math.pow(baseA, 2) + Math.pow(baseT, 2)) : 0,
        4: baseS ? Math.sqrt(Math.pow(baseS, 2) + Math.pow(baseS, 2)) : 0,
    };
    const _r = r ? r : rList[nBaseVertices];

    return (
        <animated.mesh
            ref={ref}
            scale={1}
            position={[0, 0 + t / 2, 0]}
        >
            <Cylinder args={[_r, _r, t, nBaseVertices]}>
                <meshNormalMaterial wireframe={wireframe} />
            </Cylinder>
        </animated.mesh>
    );
});
Prism.displayName = 'Prism';

export default Prism;