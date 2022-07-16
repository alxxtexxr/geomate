import { forwardRef } from 'react';
import Pyramid from './Pyramid';

// Types
export type Props = {
    r: number,
    t: number,
    nBaseVertices: number,
    wireframe: boolean,
};

const Cone = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ r, t, wireframe }, ref) => (
    <Pyramid
        ref={ref}
        r={r}
        t={t}
        nBaseVertices={64}
        wireframe={wireframe}
    />
));

export default Cone;