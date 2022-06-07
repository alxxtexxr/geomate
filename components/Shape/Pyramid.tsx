import { useRef } from 'react'
import { MathUtils as ThreeMath } from 'three'
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';

// Types
import type { SpringValue } from '@react-spring/three';
import type { Mesh, BufferGeometry, Material } from 'three';

export type Props = {
    r: number,
    t: number,
    nBaseVertices: number,
    rotation: SpringValue<number[]>,
    wireframe: boolean,
};

const { degToRad } = ThreeMath

const Pyramid = ({ r, t, nBaseVertices, rotation, wireframe }: Props) => {
    const mesh = useRef<Mesh<BufferGeometry, Material | Material[]>>(null)

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.01;
        }
    });

    return (
        <animated.mesh
            ref={mesh}
            scale={1}
            rotation={rotation.to((x, y, z) => [degToRad(x), degToRad(y), degToRad(z)]) as unknown as [x: number, y: number, z: number]}
        >
            <coneGeometry args={[r, t, nBaseVertices]} />
            <meshNormalMaterial wireframe={wireframe} />
        </animated.mesh>
    );
};

export default Pyramid;