import Pyramid from './Pyramid';

const Cone = ({ radius, height, rotation, wireframe, ...props }) => (
    <Pyramid
        {...props}
        radius={radius}
        height={height}
        radialSegments={64}
        rotation={rotation}
        wireframe={wireframe}
    />
);

export default Cone;