import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// Utils
import { getLevel } from './../../../Utils';

// GET /api/evaluations/:id
// PUT /api/evaluations/:id
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
                                evaluationId: true,
                                answer: true,
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
                const { isCompleted } = req.body;
                let score;

                if (isCompleted) {
                    // Calculate score
                    const evaluationQuestions = await prisma.evaluationQuestion.findMany({
                        where: { evaluationId: id as string },
                        select: {
                            isCorrect: true,
                            question: {
                                select: {
                                    shapeCode: true
                                },
                            }
                        },
                    });
                    const nEvaluationQuestions = evaluationQuestions.length;
                    const nCorrectEvaluationQuestions = evaluationQuestions.filter((evaluationQuestion) => evaluationQuestion.isCorrect).length;

                    score = nCorrectEvaluationQuestions / nEvaluationQuestions * 100;

                    if (session.user?.email) {
                        // Update XP and level
                        if (score) {
                            await prisma.user.update({
                                where: { email: session.user.email },
                                data: {
                                    xp: session.user.xp + score,
                                    level: getLevel(session.user.xp + score)
                                },
                            });
                        }

                        // Set achievemnent [shapeCodename]_evaluation
                        // !!! Have to check if [shapeCodename]_evaluation is exist !!!
                        await prisma.userAchievement.create({
                            data: {
                                user: {
                                    connect: {
                                        email: session.user.email,
                                    },
                                },
                                achievement: {
                                    connect: {
                                        code: `${evaluationQuestions[0].question.shapeCode}_evaluation`,
                                    },
                                },
                            },
                        });
                    }
                }

                const result = await prisma.evaluation.update({
                    where: { id: id as string },
                    data: {
                        isCompleted: isCompleted,
                        score: score,
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