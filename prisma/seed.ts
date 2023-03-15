import { PrismaClient, } from '@prisma/client';

import type { Prisma, ShapeCode } from '@prisma/client';

const prisma = new PrismaClient()

const main = async () => {
    // Comment codes below if you don't want to delete them
    await prisma.answerChoice.deleteMany();
    await prisma.evaluationQuestion.deleteMany();
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
            {
                id: '1',
                shapeCode: 'cylinder',
                question: 'Sebuah kaleng roti berbentuk tabung berdiameter 28 cm dan tingginya 10 cm. Volume kaleng roti tersebut adalah .... cm³',
                correctAnswer: '15',
                type: 'multiple_choices',
            },
            {
                id: '2',
                shapeCode: 'cylinder',
                question: 'Tabung adalah bangun ruang yang terbentuk dari 3 bidang sisi yaitu ....',
                correctAnswer: '2',
                type: 'multiple_choices',
            },
            {
                id: '3',
                shapeCode: 'cylinder',
                question: 'Rumus volume dan luas seluruh permukaan tabung adalah ....',
                correctAnswer: '5',
                type: 'multiple_choices',
            },
            {
                id: '4',
                shapeCode: 'cylinder',
                question: 'Rumus luas selimut tabung adalah ....',
                correctAnswer: '9',
                type: 'multiple_choices',
            },
            {
                id: '5',
                shapeCode: 'cylinder',
                question: 'Sebuah tabung memiliki jari - jari 21 cm dan tinggi 15 cm. Volume dari tabung tersebut adalah .... cm³',
                correctAnswer: '19',
                type: 'multiple_choices',
            },
            {
                id: '6',
                shapeCode: 'cylinder',
                question: 'Sebuah tabung volumenya 36.960 cm³. Jika tinggi tabung tersebut 15 cm, maka diameter tabung tersebut adalah .... cm.',
                correctAnswer: '23',
                type: 'multiple_choices',
            },
            {
                id: '7',
                shapeCode: 'cylinder',
                question: 'Pak Hudi memiliki tangki minyak berbentuk tabung berdiameter 2 m dengan tinggi 1,4 meter. Mula-mula tangki diisi minyak hingga penuh, namun karena bocor, isinya tinggal 4/5 nya saja. Minyak yang mengalir karena bocor sebanyak .... liter',
                correctAnswer: '25',
                type: 'multiple_choices',
            },
            {
                id: '8',
                shapeCode: 'cylinder',
                question: 'Diketahui luas alas tabung 154 cm² dan tingginya 16 cm. Volume dan luas selimut tabung tabung adalah ....',
                correctAnswer: '29',
                type: 'multiple_choices',
            },
            {
                id: '9',
                shapeCode: 'cylinder',
                question: 'Sebuah tabung tanpa tutup memiliki luas selimut 880 cm². Jika diketahui tinggi tabung 10 cm, maka luas permukaan tabung tersebut adalah .... cm²',
                correctAnswer: '34',
                type: 'multiple_choices',
            },
            {
                id: '10',
                shapeCode: 'cylinder',
                question: 'Bak mandi di rumah Anton berbentuk tabung dengan panjang diameternya 1 m dan tingginya 1,05 m. Bak tersebut telah berisi 2/3 nya. Untuk memenuhi bak tersebut, Anton harus mengisinya sebanyak .... liter',
                correctAnswer: '38',
                type: 'multiple_choices',
            },
        ],
    });
    const createdAnswerChoices = await prisma.answerChoice.createMany({
        data: [
            { id: '1', questionId: '2', answer: '2 berbentuk persegi panjang dan 1 berbentuk lingkaran' },
            { id: '2', questionId: '2', answer: '1 berbentuk persegi panjang dan 2 berbentuk lingkaran' },
            { id: '3', questionId: '2', answer: '1 berbentuk persegi panjang dan 2 berbentuk segitiga' },
            { id: '4', questionId: '2', answer: '2 berbentuk persegi dan 1 berbentuk lingkaran' },
            { id: '5', questionId: '3', answer: 'V = π x r² x t, dan L = 2πr x (r+t)' },
            { id: '6', questionId: '3', answer: 'V = π x r x t, dan L = πr x (r+t)' },
            { id: '7', questionId: '3', answer: 'V = π x r² x t, dan L = 2πr x (rxt)' },
            { id: '8', questionId: '3', answer: 'V = π x r x t, dan L = 2πr x (r+t)' },
            { id: '9', questionId: '4', answer: '2π x r x t' },
            { id: '10', questionId: '4', answer: 'π x r² x t' },
            { id: '11', questionId: '4', answer: 'π x r x t' },
            { id: '12', questionId: '4', answer: '2π x r² x t' },
            { id: '13', questionId: '1', answer: '6.180' },
            { id: '14', questionId: '1', answer: '6.210' },
            { id: '15', questionId: '1', answer: '6.160' },
            { id: '16', questionId: '1', answer: '6.260' },
            { id: '17', questionId: '5', answer: '21.790' },
            { id: '18', questionId: '5', answer: '20.890' },
            { id: '19', questionId: '5', answer: '20.790' },
            { id: '20', questionId: '5', answer: '20.990' },
            { id: '21', questionId: '6', answer: '54' },
            { id: '22', questionId: '6', answer: '52' },
            { id: '23', questionId: '6', answer: '56' },
            { id: '24', questionId: '6', answer: '58' },
            { id: '25', questionId: '7', answer: '880' },
            { id: '26', questionId: '7', answer: '780' },
            { id: '27', questionId: '7', answer: '800' },
            { id: '28', questionId: '7', answer: '850' },
            { id: '29', questionId: '8', answer: 'V = 2.464 cm³ , Luas selimut = 704 cm²' },
            { id: '30', questionId: '8', answer: 'V = 2.464 cm³ , Luas selimut = 726 cm²' },
            { id: '31', questionId: '8', answer: 'V = 2.464 cm³ , Luas selimut = 706 cm²' },
            { id: '32', questionId: '8', answer: 'V = 2.464 cm³ , Luas selimut = 712 cm²' },
            { id: '33', questionId: '9', answer: '1.490' },
            { id: '34', questionId: '9', answer: '1.496' },
            { id: '35', questionId: '9', answer: '1.498' },
            { id: '36', questionId: '9', answer: '1.494' },
            { id: '37', questionId: '10', answer: '270' },
            { id: '38', questionId: '10', answer: '275' },
            { id: '39', questionId: '10', answer: '280' },
            { id: '40', questionId: '10', answer: '285' },
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

