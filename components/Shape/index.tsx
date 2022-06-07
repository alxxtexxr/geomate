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
import type ShapeCodename from '../../types/ShapeCodename';

// type _Props = {
//   r: number,
//   t: number,
//   radialSegments: number,
//   rotation: SpringValue<number[]>,
//   wireframe: boolean,
// };
type Props = { codename: ShapeCodename } & any;

const shapeComponents: { [key: string]: React.FC<any> } = {
  Cylinder,
  Prism,
  Cone,
  Pyramid,
  Sphere,
};

const Shape = ({ codename, ...props }: Props) => {
  const ShapeComponent = shapeComponents[snakeToPascal(codename)];

  // if shape component undefined ...

  return <ShapeComponent {...props} />
};

export default Shape;