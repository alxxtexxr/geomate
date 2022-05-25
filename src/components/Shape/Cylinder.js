import Prism from './Prism';

const Cylinder = ({ r, t, rotation, wireframe }) => (
    <Prism
        r={r}
        t={t}
        radialSegments={64}
        rotation={rotation}
        wireframe={wireframe}
    />
);

export default Cylinder;