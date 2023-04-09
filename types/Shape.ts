import type { ShapeCode } from '@prisma/client';

type Shape = {
    code: ShapeCode,
    name: string,
    description: string,
    vFormula: string,
    vFormulaRounded: string,
    vFormulaUndiscovered: string | string[],
    vFormulaUndiscoveredMathSymbols?: string[],
    vFormulaDiscovered: string,

    // v2.x 
    introductionMessages: { 
        image?: string, 
        message: string,
        reply: string,
    }[],

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