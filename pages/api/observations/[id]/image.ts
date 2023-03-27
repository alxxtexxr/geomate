import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
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

    const session = await getSession({ req });

    if (session) { // Disable this if you want to test it with Postman
        switch (req.method) {
            case 'PUT':
                const imageFile = await getImage(req);
                const uploadedImage: any = await uploadImage(imageFile.path);
                const image = uploadedImage.secure_url;
                
                // const result = await prisma.observation.update({
                //     where: { id: id as string },
                //     data: { image: image },
                // });
                const result = 'Coming soon...';

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