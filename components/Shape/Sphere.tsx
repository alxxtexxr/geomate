import { forwardRef } from 'react';
import * as THREE from 'three';
import { animated } from '@react-spring/three';
import { Sphere } from '@react-three/drei';

// Types
export type Props = {
    r: number,
    wireframe?: boolean,
};

const MySphere = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ r, wireframe = false }, ref) => (
    <animated.mesh
        ref={ref}
        scale={1}
        position={[0, 0 + r, 0]}
    >
        <Sphere args={[r, 64, 32]}>
            <meshNormalMaterial wireframe={wireframe} />
        </Sphere>
    </animated.mesh>
));
MySphere.displayName = 'MySphere';

export default MySphere;