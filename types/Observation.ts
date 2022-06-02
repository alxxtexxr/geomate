// Types
import type Shape from './Shape';

type Observation = {
    id: string;
    nVertices?: number;
    nEdges?: number;
    nFaces?: number;
    r?: number;
    t?: number;
    s?: number;
    la?: number;
    lst?: number;
    ka?: number;
    v?: number;
    lp?: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    shapeId: string;
    shape?: Shape
};

export default Observation;