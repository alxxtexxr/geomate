import type { ShapeCode } from '@prisma/client';

type Shape = {
    code: ShapeCode,
    name: string,
    stimulation: string,
    stimulationImage: string,
    problemIdentification: string,
    problemIdentificationImage: string,
    description: string,
    nVertices: number | string,
    nEdges: number | string,
    nFaces: number | string,
    vFormula: string,
    lpFormula: string,
};

export default Shape;