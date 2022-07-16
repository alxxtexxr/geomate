import { forwardRef } from 'react';
import Sphere from './Sphere';
import Cylinder from './Cylinder';
import Prism from './Prism';
import Cone from './Cone';
import Pyramid from './Pyramid';

// Utils
import { snakeToPascal } from '../../Utils';

// Types
// import type { Props as SphereProps } from './Sphere';
// import type { Props as CylinderProps } from './Cylinder';
// import type { Props as PrismProps } from './Prism';
// import type { Props as ConeProps } from './Cone';
// import type { Props as PyramidProps } from './Pyramid';
// import type { SpringValue } from '@react-spring/three';
import type { ShapeCode } from '@prisma/client';

// type _Props = {
//   r: number,
//   t: number,
//   radialSegments: number,
//   rotation: SpringValue<number[]>,
//   wireframe: boolean,
// };
type Props = { code: ShapeCode } & any;

const shapeComponents: { [key: string]: React.FC<any> } = {
  Cylinder,
  Prism,
  Cone,
  Pyramid,
  Sphere,
};

const Shape = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ code, ...props }, ref) => {
  const ShapeComponent = shapeComponents[snakeToPascal(code)];

  // if shape component undefined ...

  return <ShapeComponent ref={ref} {...props} />
}) 

export default Shape;