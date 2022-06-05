import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// GET /api/observations/:id
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    const shape = await prisma.observation.findUnique({
        where: { id: id as string },
    });

    res.json(shape);
};

export default handle;