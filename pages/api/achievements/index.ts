import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// Utils
import { getQuery } from '../../../Utils';

// Types
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prisma } from '@prisma/client';

// GET /api/user-achievements
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
        switch (req.method) {
            case 'GET':
                const { orderBy } = await getQuery({ req });

                const achievements = await prisma.achievement.findMany({
                    orderBy: orderBy as Prisma.AchievementOrderByWithRelationInput,
                    where: {
                        // Get user achievements if achievement is earned
                        userAchievements: {
                            every: {
                                user: {
                                    email: session.user?.email
                                },
                            },
                        },
                    },
                    select: {
                        id: true,
                        title: true,
                        userAchievements: {
                            select: {
                                user: {
                                    select: {
                                        email: true,
                                    },
                                },
                            },
                        },
                    }
                });

                res.json(achievements);
                break;
            default:
                throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
        }
    } else {
        res.status(401).send({ message: 'Unauthorized.' });
    }
};

export default handle;