import React, { useRef, useCallback } from 'react'
import { Math as ThreeMath } from 'three'
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, useTransition, config, animated } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';

const { degToRad } = ThreeMath

const Pyramid = ({ geometryArgs = [2, 2, 4, 1], rotation, ...props }) => {
  const mesh = useRef(null)

  useFrame((state, delta) => (mesh.current.rotation.y += 0.01));

  return (
    <animated.mesh
      {...props}
      ref={mesh}
      scale={1}
      rotation={rotation.to((x, y, z) => [degToRad(x), degToRad(y), degToRad(z)])}
    >
      <coneGeometry args={geometryArgs} />
      <meshStandardMaterial color="orange" />
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
        <Pyramid rotation={rotation} />
      </Canvas>
    </div>
  );
};

export default App;
