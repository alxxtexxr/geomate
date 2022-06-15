import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// PUT /api/notifications
// Required fields in body: isRead
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const session = await getSession({ req });

    if (session) { // Disable this if you want to test it with Postman
        switch (req.method) {
            case 'PUT':
                const { isRead } = req.body;

                const result = await prisma.notification.update({
                    where: { id: id as string },
                    data: {
                        isRead: isRead,
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