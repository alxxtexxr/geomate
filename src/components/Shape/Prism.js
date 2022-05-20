import { useRef } from 'react'
import { Math as ThreeMath } from 'three'
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';

const { degToRad } = ThreeMath

const Prism = ({ radius, height, radialSegments, rotation, wireframe, ...props }) => {
    const mesh = useRef(null)

    useFrame(() => (mesh.current.rotation.y += 0.01));

    return (
        <animated.mesh
            {...props}
            ref={mesh}
            scale={1}
            rotation={rotation.to((x, y, z) => [degToRad(x), degToRad(y), degToRad(z)])}
        >
            <cylinderGeometry args={[radius, radius, height, radialSegments]} />
            <meshNormalMaterial wireframe={wireframe} />
        </animated.mesh>
    );
};

export default Prism;