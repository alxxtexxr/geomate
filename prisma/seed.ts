import { PrismaClient, } from '@prisma/client';

import type { Prisma, ShapeCode } from '@prisma/client';

const prisma = new PrismaClient()

const main = async () => {
    // Comment codes below if you don't want to delete them
    await prisma.answerChoice.deleteMany();
    await prisma.question.deleteMany();
    await prisma.evaluationQuestion.deleteMany();
    await prisma.evaluation.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();

    const shapeCodes: ShapeCode[] = ['sphere', 'cylinder', 'prism', 'cone', 'pyramid'];
    let createdQuestionsData: Prisma.Enumerable<Prisma.QuestionCreateManyInput> = [];

    shapeCodes.map((shapeCode) => {
        if (Array.isArray(createdQuestionsData)) {
            createdQuestionsData = [
                ...createdQuestionsData,
                {
                    shapeCode: shapeCode,
                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet est mauris.',
                    correctAnswer: '',
                    type: 'multiple_choices',
                },
                {
                    shapeCode: shapeCode,
                    question: 'Suspendisse potenti. Nulla auctor, diam non hendrerit luctus, enim enim fermentum orci, et imperdiet massa magna eu felis.',
                    correctAnswer: '',
                    type: 'multiple_choices',
                },
                {
                    shapeCode: shapeCode,
                    question: 'Duis sit amet dui dui. Morbi nec erat molestie, tincidunt lectus a, convallis ex.',
                    correctAnswer: '',
                    type: 'multiple_choices',
                }
            ]
        }
    });

    const createdQuestions = await prisma.question.createMany({ data: createdQuestionsData });
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
            { code: 'sphere_evaluation', title: 'Si Paham Bola' },
            { code: 'cylinder_evaluation', title: 'Si Paham Tabung' },
            { code: 'prism_evaluation', title: 'Si Paham Prisma' },
            { code: 'cone_evaluation', title: 'Si Paham Kerucut' },
            { code: 'pyramid_evaluation', title: 'Si Paham Limas' },
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

