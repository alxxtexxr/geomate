import { forwardRef } from 'react';
import Pyramid from './Pyramid';

// Types
export type Props = {
    r: number,
    t: number,
    x: number,
    nBaseVertices: number,
    wireframe: boolean,
};

const Cone = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ r, t, x, wireframe }, ref) => (
    <Pyramid
        ref={ref}
        r={r}
        t={t}
        x={x}
        nBaseVertices={64}
        wireframe={wireframe}
    />
));
Cone.displayName = 'Cone';

export default Cone;