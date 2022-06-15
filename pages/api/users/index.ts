import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// Utils
import { getQuery } from '../../../Utils';

// Types
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prisma } from '@prisma/client';

// GET /api/users
// Required params in body: sortBy
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
        switch (req.method) {
            case 'GET':
                const { orderBy } = await getQuery({ req });

                const users = await prisma.user.findMany({
                    orderBy: orderBy as Prisma.UserOrderByWithRelationInput,
                    select: {
                        name: true,
                        image: true,
                        xp: true,
                    },
                });

                res.json(users);
                break;
            default:
                throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
        }
    } else {
        res.status(401).send({ message: 'Unauthorized.' });
    }
};

export default handle;