import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// GET /api/observations/:id
// PUT /api/observations
// Optional fields in body: shapeCode
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const session = await getSession({ req });

    if (session) { // Disable this if you want to test it with Postman
        switch (req.method) {
            case 'GET':
                const observation = await prisma.observation.findUnique({
                    where: { id: id as string },
                    include: {
                        postTestQuestion: {
                            select: {
                                question: true,
                                image: true,
                                answerChoices: true,
                            },
                        },
                    },
                });

                res.json(observation);
                break;
            case 'PUT':
                const {
                    r,
                    t,
                    v,
                    comparisonV,
                    isCompleted,
                    postTestAnswer,
                } = req.body;

                let isPostTestCorrect;

                // If there's post-test answer, check if post-test correct
                if (postTestAnswer) {
                    // Get the correct answer of observation post-test question 
                    const observation = await prisma.observation.findUnique({
                        where: { id: id as string },
                        select: {
                            postTestQuestion: {
                                select: {
                                    correctAnswer: true,
                                }
                            },
                        }
                    });

                    // Throw error if observation doesn't exist
                    if (!observation) { throw new Error('No observation found.'); }

                    // Check if post-test correct
                    isPostTestCorrect = postTestAnswer === observation.postTestQuestion.correctAnswer;
                }

                // Update observation
                const result = await prisma.observation.update({
                    where: { id: id as string },
                    data: {
                        r: r,
                        t: t,
                        v: v,
                        comparisonV: comparisonV,
                        isCompleted: isCompleted,

                        // Post-test
                        postTestAnswer: postTestAnswer,
                        isPostTestCorrect: isPostTestCorrect,
                    },
                });

                res.json(result);
                break;
            default:
                throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
        }
    } else {
        res.status(401).send({ message: 'Unauthorized.' });
    }
};

export default handle;