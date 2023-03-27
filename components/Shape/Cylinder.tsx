import { forwardRef } from 'react';
import Prism from './Prism';

// Types
export type Props = {
    r: number,
    t: number,
    nBaseVertices: number,
    color: string,
    opacity?: number,
};

const Cylinder = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ r, t, color, opacity }, ref) => (
    <Prism
        ref={ref}
        r={r}
        t={t}
        nBaseVertices={64}
        color={color}
        opacity={opacity}
    />
));
Cylinder.displayName = 'Cylinder';

export default Cylinder;