import { SHAPES } from './Constants';

export const getShapeByI = (i: number) => SHAPES[i];
export const getShapeByCodename = (codename: string) => SHAPES.filter((SHAPE) => SHAPE.codename === codename)[0];