import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// Types
import type { NextApiRequest, NextApiResponse } from 'next';

// POST /api/evaluations
// Required fields in body: shapeCodename
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
        switch (req.method) {
            case 'POST':
                const { shapeCodename } = req.body;

                const questions = await prisma.question.findMany({
                    where: {
                        shapeCodename: shapeCodename,
                    },
                });

                const evaluation = await prisma.evaluation.create({
                    data: {
                        user: { connect: { email: session.user?.email as string } },
                        evaluationQuestions: {
                            create: questions.map((question) => ({
                                question: {
                                    connect: {
                                        id: question.id,
                                    }
                                }
                            }))
                        }
                    },
                });
                
                res.json(evaluation);
                break;
            default:
                throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
        }
    } else {
        res.status(401).send({ message: 'Unauthorized.' });
    }
};

export default handle;