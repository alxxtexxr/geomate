import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin',
        },
    });

    console.log({ admin });
};

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })