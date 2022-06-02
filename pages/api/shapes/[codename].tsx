import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// GET /api/shapes/:codename
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const codename = req.query.codename;

    const shape = await prisma.shape.findUnique({
        where: { codename: codename as string },
    });

    res.json(shape);
};

export default handle;