import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// Types
import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/notifications
// POST /api/notifications
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
        switch (req.method) {
            case 'GET':
                const notifications = await prisma.notification.findMany({
                    where: { 
                        user: { email: session.user?.email },
                        isRead: false,
                    },
                    select: {
                        id: true,
                        title: true,
                    }
                });

                res.json(notifications);
                break;
            default:
                throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
        }
    } else {
        res.status(401).send({ message: 'Unauthorized.' });
    }
};

export default handle;