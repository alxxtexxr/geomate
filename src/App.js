import React, { useRef, useCallback } from 'react'
import { Math as ThreeMath } from 'three'
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, useTransition, config, animated } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';

// Shapes: Pyramid, Cone, Prism, Cylinder, Sphere

const { degToRad } = ThreeMath

const Pyramid = ({ radius, height, radialSegments, rotation, ...props }) => {
  const mesh = useRef(null)

  useFrame(() => (mesh.current.rotation.y += 0.01));

  return (
    <animated.mesh
      {...props}
      ref={mesh}
      scale={1}
      rotation={rotation.to((x, y, z) => [degToRad(x), degToRad(y), degToRad(z)])}
    >
      <coneGeometry args={[radius, height, radialSegments]} />
      <meshNormalMaterial/>
    </animated.mesh>
  );
};

const Cone = ({ radius, height, rotation, ...props }) => (
  <Pyramid
    {...props}
    radius={radius}
    height={height}
    radialSegments={64}
    rotation={rotation}
  />
);

const Prism = ({ radius, height, radialSegments, rotation, ...props }) => {
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
      <meshNormalMaterial/>
    </animated.mesh>
  );
};

const Cylinder = ({ radius, height, rotation, ...props }) => (
  <Prism
    {...props}
    radius={radius}
    height={height}
    radialSegments={64}
    rotation={rotation}
  />
);

const Sphere = ({ radius, rotation, ...props }) => {
  const mesh = useRef(null)

  useFrame(() => (mesh.current.rotation.y += 0.01));

  return (
    <animated.mesh
      {...props}
      ref={mesh}
      scale={1}
      rotation={rotation.to((x, y, z) => [degToRad(x), degToRad(y), degToRad(z)])}
    >
      <sphereGeometry args={[radius, 64, 32]} />
      <meshNormalMaterial/>
    </animated.mesh>
  );
};

const App = () => {
  const [{ rotation }, setRotation] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
  }))

  const bind = useDrag(({ delta, velocity, direction, memo = rotation.get() }) => {
    const x = memo[0] + (delta[1] / window.innerWidth) * 180;
    const y = memo[1] + (delta[0] / window.innerHeight) * 180;
    const vxyz = [direction[1] * (velocity[1] / 1), direction[0] * (velocity[0] / 1), 0];

    setRotation({
      rotation: [x, y, 0],
      config: { velocity: vxyz, decay: true }
    });

    return memo;
  });

  return (
    <div {...bind()} style={{ touchAction: 'none' }}>
      <Canvas style={{ backgroundColor: '#eeeeee', height: '50vh', }}>
        <ambientLight color="#888888" />
        <pointLight position={[10, 20, 0]} />
        <Pyramid radius={2} height={2} radialSegments={4} rotation={rotation} />
      </Canvas>
    </div>
  );
};

export default App;
