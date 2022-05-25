import Sphere from './Sphere';
import Cylinder from './Cylinder';
import Prism from './Prism';
import Cone from './Cone';
import Pyramid from './Pyramid';

const shapeComponents = {
    Sphere,
    Cylinder,
    Prism,
    Cone,
    Pyramid,
};

const snakeToPascal = (string) => {
    return string.split("/")
      .map(snake => snake.split("_")
        .map(substr => substr.charAt(0)
          .toUpperCase() +
          substr.slice(1))
        .join(""))
      .join("/");
  };

const Shape = ({codename, ...props}) => {
    const ShapeComponent = shapeComponents[snakeToPascal(codename)]

    // if shape component undefined ...

    return <ShapeComponent {...props} />
};

export default Shape;