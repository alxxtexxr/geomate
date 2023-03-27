import { forwardRef } from 'react'
import * as THREE from 'three';
import { animated } from '@react-spring/three';
import { Cone } from '@react-three/drei';

// Tailwind Config
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig)

// Types
export type Props = {
    r: number,
    t: number,
    x: number,
    nBaseVertices: number,
    baseA?: number,
    baseT?: number,
    baseS?: number,
    color?: string,
    opacity?: number,
};

const Pyramid = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ 
    r, 
    t, 
    x,
    nBaseVertices, 
    baseA, 
    baseT, 
    baseS, 
    color = fullConfig.daisyui.themes[0].mytheme.primary, 
    opacity = 1,
 }, ref) => {
    const rList: { [key: number]: number } = {
        3: baseA && baseT ? Math.sqrt(Math.pow(baseA, 2) + Math.pow(baseT, 2)) : 0,
        4: baseS ? Math.sqrt(Math.pow(baseS, 2) + Math.pow(baseS, 2)) : 0,
    };
    const _r = r ? r : rList[nBaseVertices];

    return (
        <animated.mesh
            ref={ref}
            scale={1}
            position={[x, 0 + t / 2, 0]}
        >
            <Cone args={[_r, t, nBaseVertices]}>
                <meshMatcapMaterial
                    color={color}
                    transparent
                    opacity={opacity}
                />
            </Cone>
        </animated.mesh>
    );
});
Pyramid.displayName = 'Pyramid';

export default Pyramid;