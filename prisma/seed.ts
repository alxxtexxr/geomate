import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const main = async () => {
    // Comment codes below if you don't want to delete them
    await prisma.answerChoice.deleteMany();
    await prisma.question.deleteMany();
    await prisma.evaluationQuestion.deleteMany();
    await prisma.evaluation.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();

    const createdQuestions = await prisma.question.createMany({
        data: [
            {
                shapeCode: 'pyramid',
                question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet est mauris.',
                correctAnswer: '',
                type: 'multiple_choices',
            },
            {
                shapeCode: 'pyramid',
                question: 'Suspendisse potenti. Nulla auctor, diam non hendrerit luctus, enim enim fermentum orci, et imperdiet massa magna eu felis.',
                correctAnswer: '',
                type: 'multiple_choices',
            },
            {
                shapeCode: 'pyramid',
                question: 'Duis sit amet dui dui. Morbi nec erat molestie, tincidunt lectus a, convallis ex.',
                correctAnswer: '',
                type: 'multiple_choices',
            },
        ],
    });

    const questions = await prisma.question.findMany();

    // Create answer choices
    questions.map(async (question) => {
        await prisma.answerChoice.createMany({
            data: question.question.split('. ').map((answer) => ({
                questionId: question.id,
                answer: answer,
            }))
        });

        const answerChoice = await prisma.answerChoice.findFirst({
            where: { questionId: question.id },
        });

        await prisma.question.update({
            where: { id: question.id },
            data: {
                correctAnswer: answerChoice?.id,
            },
        });
    });

    const createdAchievements = await prisma.achievement.createMany({
        data: [
            { code: 'sphere_evaluation', title: 'Menyelesaikan Evaluasi Bola' },
            { code: 'cylinder_evaluation', title: 'Menyelesaikan Evaluasi Tabung' },
            { code: 'prism_evaluation', title: 'Menyelesaikan Evaluasi Prisma' },
            { code: 'cone_evaluation', title: 'Menyelesaikan Evaluasi Kerucut' },
            { code: 'pyramid_evaluation', title: 'Menyelesaikan Evaluasi Limas' },
        ],
    });

    console.log({ createdQuestions, createdAchievements });
};

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });

