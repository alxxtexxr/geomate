import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

import { ShapeCode } from '@prisma/client';

// Constants
import { NEXT_SHAPE_CODE_MAP, SHAPE_NAME_MAP } from '../../Constants';

// Types
import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/home-menu
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
        switch (req.method) {
            case 'GET':
                let menu = Object.keys(ShapeCode).map((shapeCode) => ({
                    code: shapeCode,
                    name: SHAPE_NAME_MAP[shapeCode],
                    isLocked: !(shapeCode === 'cylinder'),
                }));

                const completedEvaluations = await prisma.evaluation.findMany({
                    where: {
                        user: { email: session.user?.email },
                        isCompleted: true,
                    },
                    select: { shapeCode: true },
                });

                // If evaluation in a specific shape is completed, unlock the next shape
                completedEvaluations.map((evaluation) => {
                    // Find the menu item status of the next shape 
                    const menuItemToUpdate = menu.find((itemStatus) =>
                        NEXT_SHAPE_CODE_MAP[itemStatus.code] &&
                        itemStatus.code === NEXT_SHAPE_CODE_MAP[evaluation.shapeCode]
                    );

                    // Unlock the found menu item status
                    if (menuItemToUpdate) {
                        menuItemToUpdate.isLocked = false;
                    }
                });

                res.json(menu);
                break;
            default:
                throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
        }
    } else {
        res.status(401).send({ message: 'Unauthorized.' });
    }
};

export default handle;