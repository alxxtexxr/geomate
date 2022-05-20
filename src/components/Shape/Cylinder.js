import Prism from './Prism';

const Cylinder = ({ radius, height, rotation, wireframe, ...props }) => (
    <Prism
        {...props}
        radius={radius}
        height={height}
        radialSegments={64}
        rotation={rotation}
        wireframe={wireframe}
    />
);

export default Cylinder;