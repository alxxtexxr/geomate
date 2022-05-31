import { SHAPES } from './Constants';

export const getShape = (codename) => SHAPES.filter((SHAPE) => SHAPE.codename === codename)[0];