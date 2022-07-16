import { forwardRef } from 'react';
import Prism from './Prism';

// Types
export type Props = {
    r: number,
    t: number,
    nBaseVertices: number,
    wireframe: boolean,
};

const Cylinder = forwardRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, Props>(({ r, t, wireframe }, ref) => (
    <Prism
        ref={ref}
        r={r}
        t={t}
        nBaseVertices={64}
        wireframe={wireframe}
    />
));

export default Cylinder;