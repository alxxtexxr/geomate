import Pyramid from './Pyramid';

const Cone = ({ r, t, rotation, wireframe }) => (
    <Pyramid
        r={r}
        t={t}
        radialSegments={64}
        rotation={rotation}
        wireframe={wireframe}
    />
);

export default Cone;