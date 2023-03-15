import { forwardRef } from 'react';
import Pyramid from './Pyramid';

// Types
export type Props = {
    r: number,
    t: number,
    x: number,
    nBaseVertices: number,
    color?: string,
    opacity?: number,
};

const Cone = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ r, t, x, color, opacity }, ref) => (
    <Pyramid
        ref={ref}
        r={r}
        t={t}
        x={x}
        nBaseVertices={64}
        color={color}
        opacity={opacity}
    />
));
Cone.displayName = 'Cone';

export default Cone;