import React, { useRef } from 'react'
import { Math as ThreeMath } from 'three'
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';

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
      <meshNormalMaterial />
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
      <meshNormalMaterial />
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
      <meshNormalMaterial />
    </animated.mesh>
  );
};

const Observation = () => {
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
    <main className="h-screen">
      <div {...bind()} className="h-1/2" style={{ touchAction: 'none' }}>
        <Canvas>
          <ambientLight color="#888888" />
          <pointLight position={[10, 20, 0]} />
          <Cylinder radius={2} height={2} radialSegments={4} rotation={rotation} />
        </Canvas>
      </div>
      <div className="flex flex-col h-1/2">
        <div class="tabs">
          <a class="tab tab-bordered w-1/3 h-12">Informasi</a>
          <a class="tab tab-bordered w-1/3 h-12">Sifat</a>
          <a class="tab tab-bordered tab-active w-1/3 h-12">Ukuran</a>
        </div>
        <div className="flex flex-grow flex-col justify-between p-4">
          <div>
            <div class="flex flex-row w-full mb-4">
              <label class="label w-1/3">
                <span class="label-text">Radius</span>
              </label>
              <input type="text" placeholder="0" class="input input-bordered w-2/3" />
            </div>
            <div class="flex flex-row w-full mb-4">
              <label class="label w-1/3">
                <span class="label-text">Tinggi</span>
              </label>
              <input type="text" placeholder="0" class="input input-bordered w-2/3" />
            </div>
          </div>
          <button class="btn btn-primary w-full">SELANJUTNYA</button>
        </div>
      </div>
    </main>
  );
};

export default Observation;
