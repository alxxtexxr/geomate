import ShapeCodename from './ShapeCodename';

type Shape = {
    id: number,
    codename: ShapeCodename,
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