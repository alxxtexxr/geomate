import Pyramid from './Pyramid';

// Types
import type { SpringValue } from '@react-spring/three';

export type Props = {
    r: number,
    t: number,
    radialSegments: number,
    rotation: SpringValue<number[]>,
    wireframe: boolean,
};

const Cone = ({ r, t, rotation, wireframe }: Props) => (
    <Pyramid
        r={r}
        t={t}
        radialSegments={64}
        rotation={rotation}
        wireframe={wireframe}
    />
);

export default Cone;