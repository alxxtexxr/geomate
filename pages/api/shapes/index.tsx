import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// GET /api/shapes
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const shapes = await prisma.shape.findMany();

  res.json(shapes);
};

export default handle;