import { forwardRef } from 'react';
import * as THREE from 'three';
import { animated } from '@react-spring/three';
import { Sphere } from '@react-three/drei';

// Tailwind Config
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig)

// Types
export type Props = {
    r: number,
    color?: string,
    opacity?: number,
};

const MySphere = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ 
    r, 
    color = fullConfig.daisyui.themes[0].mytheme.primary, 
    opacity = 1,
 }, ref) => (
    <animated.mesh
        ref={ref}
        scale={1}
        position={[0, 0 + r, 0]}
    >
        <Sphere args={[r, 64, 32]}>
            <meshMatcapMaterial
                color={color}
                transparent
                opacity={opacity}
            />
        </Sphere>
    </animated.mesh>
));
MySphere.displayName = 'MySphere';

export default MySphere;