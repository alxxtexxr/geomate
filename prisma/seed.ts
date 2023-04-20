import { PrismaClient, } from '@prisma/client';

import type { Prisma, ShapeCode } from '@prisma/client';

const prisma = new PrismaClient()

const main = async () => {
    // Comment codes below if you don't want to delete them
    await prisma.answerChoice.deleteMany();
    await prisma.evaluationQuestion.deleteMany();
    await prisma.observation.deleteMany();
    await prisma.question.deleteMany();
    await prisma.evaluation.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();

    // const shapeCodes: ShapeCode[] = ['sphere', 'prism', 'cone', 'pyramid'];
    // let createdQuestionsData: Prisma.Enumerable<Prisma.QuestionCreateManyInput> = [];

    // shapeCodes.map((shapeCode) => {
    //     if (Array.isArray(createdQuestionsData)) {
    //         createdQuestionsData = [
    //             ...createdQuestionsData,
    //             {
    //                 shapeCode: shapeCode,
    //                 question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet est mauris.',
    //                 correctAnswer: '',
    //                 type: 'multiple_choices',
    //             },
    //             {
    //                 shapeCode: shapeCode,
    //                 question: 'Suspendisse potenti. Nulla auctor, diam non hendrerit luctus, enim enim fermentum orci, et imperdiet massa magna eu felis.',
    //                 correctAnswer: '',
    //                 type: 'multiple_choices',
    //             },
    //             {
    //                 shapeCode: shapeCode,
    //                 question: 'Duis sit amet dui dui. Morbi nec erat molestie, tincidunt lectus a, convallis ex.',
    //                 correctAnswer: '',
    //                 type: 'multiple_choices',
    //             }
    //         ]
    //     }
    // });

    const createdQuestions = await prisma.question.createMany({
        data: [
            // "Latihan" Questions
            {
                id: '1',
                shapeCode: 'cylinder',
                question: 'Sebuah keranjang berbentuk tabung memiliki diameter 14 cm. Jika keranjang tersebut memiliki tinggi 20 cm, berapakah volume keranjang tersebut?',
                correctAnswer: '104',
                type: 'post_test_mcq',
            },
            {
                id: '2',
                shapeCode: 'cone',
                question: 'Sebuah tumpeng dengan diameter 20 cm dan tinggi 18 cm. Berapakah volume nasi untuk membuat tumpeng tersebut?',
                correctAnswer: '203',
                type: 'post_test_mcq',
            },
            {
                id: '3',
                shapeCode: 'sphere',
                question: 'Sebuah bola memiliki jari-jari 7 cm. Berapakah volume bola tersebut?',
                correctAnswer: '302',
                type: 'post_test_mcq',
            },
        ],
    });
    const createdAnswerChoices = await prisma.answerChoice.createMany({
        data: [
            // "Latihan" Questions' Answers
            // cylinder
            { id: '101', questionId: '1', answer: '154' },
            { id: '102', questionId: '1', answer: '308' },
            { id: '103', questionId: '1', answer: '1540' },
            { id: '104', questionId: '1', answer: '3080' },

            // cone
            { id: '201', questionId: '2', answer: '188.4' },
            { id: '202', questionId: '2', answer: '314' },
            { id: '203', questionId: '2', answer: '1884' },
            { id: '204', questionId: '2', answer: '5652' },

            // sphere
            { id: '301', questionId: '3', answer: '4312' },
            { id: '302', questionId: '3', answer: '1437.33' },
            { id: '303', questionId: '3', answer: '1708' },
            { id: '304', questionId: '3', answer: '1078' },
        ],
    });

    // const questions = await prisma.question.findMany();

    // Create answer choices
    // questions.map(async (question) => {
    //     await prisma.answerChoice.createMany({
    //         data: question.question.split('. ').map((answer) => ({
    //             questionId: question.id,
    //             answer: answer,
    //         }))
    //     });

    //     const answerChoice = await prisma.answerChoice.findFirst({
    //         where: { questionId: question.id },
    //     });

    //     await prisma.question.update({
    //         where: { id: question.id },
    //         data: {
    //             correctAnswer: answerChoice?.id,
    //         },
    //     });
    // });

    const createdAchievements = await prisma.achievement.createMany({
        data: [
            { code: 'sphere_evaluation', title: 'Jenius Bola' },
            { code: 'cylinder_evaluation', title: 'Jenius Tabung' },
            // { code: 'prism_evaluation', title: 'Jenius Prisma' },
            { code: 'cone_evaluation', title: 'Jenius Kerucut' },
            // { code: 'pyramid_evaluation', title: 'Jenius Limas' },
        ],
    });

    console.log({ createdQuestions, createdAnswerChoices, createdAchievements });
};

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });

