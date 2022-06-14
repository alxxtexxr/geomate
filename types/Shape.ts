import type { ShapeCode } from '@prisma/client';

type Shape = {
    id: number,
    code: ShapeCode,
    name: string,
    stimulation: string,
    stimulationImage: string,
    problemIdentification: string,
    problemIdentificationImage: string,
    description: string,
    nVertices: number,
    nEdges: number,
    nFaces: number,
    vFormula: string,
    lpFormula: string,
};

export default Shape;