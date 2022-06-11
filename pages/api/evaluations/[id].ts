import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// GET /api/evaluations/:id
// PUT /api/evaluations
// Optional fields in body: shapeCodename
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const session = await getSession({ req });

    if (session) { // Disable this if you want to test it with Postman
        switch (req.method) {
            case 'GET':
                const evaluation = await prisma.evaluation.findUnique({
                    where: { id: id as string },
                    select: {
                        id: true,
                        score: true,
                        evaluationQuestions: {
                            select: {
                                question: {
                                    select: {
                                        id: true,
                                        image: true,
                                        question: true,
                                        answerChoices: {
                                            select: {
                                                id: true,
                                                answer: true,
                                            }
                                        }
                                    },
                                },
                            },
                        },
                    }
                });

                res.json(evaluation);
                break;
            case 'PUT':
                // const { nVertices, nEdges, nFaces, r, t, s, la, lst, ka, v, lp } = req.body;

                // const result = await prisma.evaluation.update({
                //     where: { id: id as string },
                //     data: {
                //         nVertices: nVertices,
                //         nEdges: nEdges,
                //         nFaces: nFaces,
                //         r: r,
                //         t: t,
                //         s: s,
                //         la: la,
                //         lst: lst,
                //         ka: ka,
                //         v: v,
                //         lp: lp,
                //     },
                // });

                // res.json(result);
                break;
            default:
                throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
        }
    } else {
        res.status(401).send({ message: 'Unauthorized.' });
    }
};

export default handle;