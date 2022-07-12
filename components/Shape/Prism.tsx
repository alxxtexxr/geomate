import { useRef } from 'react'
import { MathUtils as ThreeMath } from 'three'
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import { Cylinder } from '@react-three/drei';

// Types
import type { SpringValue } from '@react-spring/three';
import type { Mesh, BufferGeometry, Material } from 'three';

export type Props = {
    r: number,
    t: number,
    nBaseVertices: number,
    baseA?: number,
    baseT?: number,
    baseS?: number,
    rotation?: SpringValue<number[]>,
    wireframe?: boolean,
};

const { degToRad } = ThreeMath

const Prism = ({ r, t, nBaseVertices, baseA, baseT, baseS, rotation, wireframe = false }: Props) => {
    const mesh = useRef<Mesh<BufferGeometry, Material | Material[]>>(null);

    const rList: { [key: number]: number } = {
        3: baseA && baseT ? Math.sqrt(Math.pow(baseA, 2) + Math.pow(baseT, 2)) : 0,
        4: baseS ? Math.sqrt(Math.pow(baseS, 2) + Math.pow(baseS, 2)) : 0,
    };
    const _r = r ? r : rList[nBaseVertices];

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.01;
        }
    });

    return (
        <animated.mesh
            ref={mesh}
            scale={1}
            rotation={rotation && rotation.to((x, y, z) => [degToRad(x), degToRad(y), degToRad(z)]) as unknown as [x: number, y: number, z: number]}
        >
            <Cylinder args={[_r, _r, t, nBaseVertices]}>
                <meshNormalMaterial wireframe={wireframe} />
            </Cylinder>
        </animated.mesh>
    );
};

export default Prism;