import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// GET /api/observations/:id
// PUT /api/observations
// Optional fields in body: shapeCodename
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            const observation = await prisma.observation.findUnique({
                where: { id: id as string },
            });

            res.json(observation);
            break;
        case 'PUT':
            const { nVertices, nEdges, nFaces, r, t, s, la, lst, ka, v, lp } = req.body;

            const result = await prisma.observation.update({
                where: { id: id as string },
                data: {
                    nVertices: nVertices,
                    nEdges: nEdges,
                    nFaces: nFaces,
                    r: r,
                    t: t,
                    s: s,
                    la: la,
                    lst: lst,
                    ka: ka,
                    v: v,
                    lp: lp,
                },
            });

            res.json(result);
            break;
        default:
            throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
    }
};

export default handle;