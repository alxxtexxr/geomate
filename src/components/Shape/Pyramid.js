import { useRef } from 'react'
import { Math as ThreeMath } from 'three'
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';

const { degToRad } = ThreeMath

const Pyramid = ({ r, t, radialSegments, rotation, wireframe }) => {
    const mesh = useRef(null)
    const geometry = useRef(null)

    useFrame(() => (mesh.current.rotation.y += 0.01));

    return (
        <animated.mesh
            ref={mesh}
            scale={1}
            rotation={rotation.to((x, y, z) => [degToRad(x), degToRad(y), degToRad(z)])}
        >
            <coneGeometry ref={geometry} args={[r, t, radialSegments]} />
            <meshNormalMaterial wireframe={wireframe} />
        </animated.mesh>
    );
};

export default Pyramid;