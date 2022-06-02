import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// Types
import type { NextApiRequest, NextApiResponse } from 'next';

// POST /api/observations/:codename
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const codename = req.query.codename;
    const session = await getSession({ req });

    if (session) {
        if (req.method === 'POST') {
            const result = await prisma.observation.create({
                data: {
                    shape: { connect: { codename: codename as string } },
                    user: { connect: { email: session.user?.email as string } },
                },
            });

            res.json(result);
        } else {
            throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
        }
    } else {
        res.status(401).send({ message: 'Unauthorized.' });
    }
};

export default handle;