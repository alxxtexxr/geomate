import type { ShapeCode } from '@prisma/client';

type Shape = {
    code: ShapeCode,
    name: string,
    description: string,
    vFormula: string,

    // v2.x 
    initiation: { image?: string, content: string }[],

    // stimulation: string,
    // stimulationImage: string,
    // problemIdentification: string,
    // problemIdentificationImage: string,
    // nVertices: number | string,
    // nEdges: number | string,
    // nFaces: number | string,
    // lpFormula: string,
};

export default Shape;