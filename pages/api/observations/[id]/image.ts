import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// Utils
import { getImage, uploadImage } from '../../../../Utils';

export const config = {
    api: {
        bodyParser: false,
    },
};

// PUT /api/observations/:id/image
// Required fields in body: image
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    switch (req.method) {
        case 'PUT':
            const imageFile = await getImage(req);
            const uploadedImage: any = await uploadImage(imageFile.path);
            const image = uploadedImage.secure_url;

            const result = await prisma.observation.update({
                where: { id: id as string },
                data: { image: image },
            });

            res.json(result);
            break;
        default:
            throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
    }
};

export default handle;