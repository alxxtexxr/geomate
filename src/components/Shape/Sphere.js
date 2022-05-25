import { useRef } from 'react'
import { Math as ThreeMath } from 'three'
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';

const { degToRad } = ThreeMath

const Sphere = ({ r, rotation, wireframe }) => {
    const mesh = useRef(null)

    useFrame(() => (mesh.current.rotation.y += 0.01));

    return (
        <animated.mesh
            ref={mesh}
            scale={1}
            rotation={rotation.to((x, y, z) => [degToRad(x), degToRad(y), degToRad(z)])}
        >
            <sphereGeometry args={[r, 64, 32]} />
            <meshNormalMaterial wireframe={wireframe} />
        </animated.mesh>
    );
};

export default Sphere;