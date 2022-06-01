import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const shapeCodename = req.query.codename;

    const shape = await prisma.shape.findUnique({
        where: { codename: String(shapeCodename) },
    });

    res.json(shape);
}