import Prism from './Prism';

// Types
import type { SpringValue } from '@react-spring/three';

export type Props = {
    r: number,
    t: number,
    nBaseVertices: number,
    rotation: SpringValue<number[]>,
    wireframe: boolean,
};

const Cylinder = ({ r, t, rotation, wireframe}: Props) => (
    <Prism
        r={r}
        t={t}
        nBaseVertices={64}
        rotation={rotation}
        wireframe={wireframe}
    />
);

export default Cylinder;