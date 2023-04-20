import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// Types
import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/observations
// POST /api/observations
// Required fields in body: shapeCode
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
        switch (req.method) {
            case 'GET':
                const observations = await prisma.observation.findMany({
                    where: { user: { email: session.user?.email } },
                });

                res.json(observations);
                break;
            case 'POST':
                const { shapeCode } = req.body;

                // Get post-test question for observation
                const postTestQuestion = await prisma.question.findFirst({
                    where: {
                        shapeCode: shapeCode,
                        // type: { equals: 'post_test_mcq' },
                        type: 'post_test_mcq',
                    },
                });

                // Throw error if post-test question doesn't exist
                if (!postTestQuestion) { 
                    throw new Error('No post test question found.'); 
                }

                // Create new observation with given shape code, post-test question, and user
                const result = await prisma.observation.create({
                    data: {
                        shapeCode: shapeCode,
                        postTestQuestion: { connect: { id: postTestQuestion.id } },
                        user: { connect: { email: session.user?.email as string } },
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