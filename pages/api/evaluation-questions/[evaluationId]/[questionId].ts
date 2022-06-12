import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

// Types
import type { NextApiRequest, NextApiResponse } from 'next';

// PUT /api/evaluation-questions/:evaluationId/:questionId
// Required fields in body: evaluationId, questionId, answer
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const { evaluationId, questionId } = req.query;
    const session = await getSession({ req });

    if (session) { // Disable this if you want to test it with Postman
        switch (req.method) {
            case 'PUT':
                const { answer } = req.body;

                const question = await prisma.question.findUnique({
                    where: {
                        id: questionId as string,
                    },
                });

                const isCorrect = question?.correctAnswer === answer;

                const result = await prisma.evaluationQuestion.update({
                    where: {
                        evaluationId_questionId: {
                            evaluationId: evaluationId as string,
                            questionId: questionId as string,
                        },
                    },
                    data: {
                        answer: answer,
                        isCorrect: isCorrect,
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