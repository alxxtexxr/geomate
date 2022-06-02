import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// Types
import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/observations
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
        const observations = await prisma.observation.findMany({
            where: {
                user: {
                    email: session.user?.email,
                },
            },
        });

        res.json(observations);
    } else {
        res.status(401).send({ message: 'Unauthorized.' });
    }
};

export default handle;