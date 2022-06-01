import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
    const shapes = await prisma.shape.createMany({
        data: [
            { 
                codename: 'sphere', 
                name: 'Bola', 
                stimulation: 'Halo, Dunia!', 
                stimulationImage: 'https://api.lorem.space/image/furniture?w=240&h=240', 
                problemIdentification: 'Halo, Dunia!', 
                problemIdentificationImage: 'https://api.lorem.space/image/furniture?w=240&h=240',
                nVertices: -1,
                nEdges: -1,
                nFaces: -1,
                vFormula: 'v',
                lpFormula: 'lp',
            },
            { 
                codename: 'cylinder', 
                name: 'Tabung', 
                stimulation: 'Halo, Dunia!', 
                stimulationImage: 'https://api.lorem.space/image/furniture?w=240&h=240', 
                problemIdentification: 'Halo, Dunia!', 
                problemIdentificationImage: 'https://api.lorem.space/image/furniture?w=240&h=240',
                nVertices: -1,
                nEdges: -1,
                nFaces: -1,
                vFormula: 'v',
                lpFormula: 'lp',
            },
            { 
                codename: 'prism', 
                name: 'Prisma', 
                stimulation: 'Halo, Dunia!', 
                stimulationImage: 'https://api.lorem.space/image/furniture?w=240&h=240', 
                problemIdentification: 'Halo, Dunia!', 
                problemIdentificationImage: 'https://api.lorem.space/image/furniture?w=240&h=240',
                nVertices: -1,
                nEdges: -1,
                nFaces: -1,
                vFormula: 'v',
                lpFormula: 'lp',
            },
            { 
                codename: 'cone', 
                name: 'Kerucut', 
                stimulation: 'Halo, Dunia!', 
                stimulationImage: 'https://api.lorem.space/image/furniture?w=240&h=240', 
                problemIdentification: 'Halo, Dunia!', 
                problemIdentificationImage: 'https://api.lorem.space/image/furniture?w=240&h=240',
                nVertices: -1,
                nEdges: -1,
                nFaces: -1,
                vFormula: 'v',
                lpFormula: 'lp',
            },
            { 
                codename: 'pyramid', 
                name: 'Limas', 
                stimulation: 'Halo, Dunia!', 
                stimulationImage: 'https://api.lorem.space/image/furniture?w=240&h=240', 
                problemIdentification: 'Halo, Dunia!', 
                problemIdentificationImage: 'https://api.lorem.space/image/furniture?w=240&h=240',
                nVertices: -1,
                nEdges: -1,
                nFaces: -1,
                vFormula: 'v',
                lpFormula: 'lp',
            },
        ],
    });

    console.log({ shapes });
};

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })