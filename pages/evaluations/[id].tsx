import { useState } from 'react';
// import Router from 'next/router';
import { useRouter } from 'next/router';
// import Image from 'next/image';
import Link from 'next/link';
import { Prisma } from '@prisma/client'

// Components
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';

// Utils
import { range } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';

type Evaluation = Prisma.EvaluationGetPayload<{
    include: {
        evaluationQuestions: {
            include: {
                question: {
                    include: {
                        answerChoices: true,
                    }
                },
            },
        },
    }
}>;

type Props = {
    evaluation: Evaluation,
};

const EvalutionPage: ComponentWithAuth<Props> = ({ evaluation }) => {
    // Router
    const router = useRouter();

    // States
    const [answer, setAnswer] = useState<string | null>(null)

    const no = router.query.no ? +router.query.no : 1;
    const activeQuestion = evaluation.evaluationQuestions[no - 1].question;

    return (
        <main>
            <Navbar title="Evaluasi" />
            <div className="flex overflow-x-scroll px-3 mb-4">
                {evaluation.evaluationQuestions.map((evaluationQuestion, i) => (
                    <div className="px-1" key={evaluationQuestion.question.id}>
                        <Link href={{
                            pathname: '/evaluations/[id]',
                            query: { id: evaluation.id, no: i + 1 }
                        }} shallow>
                            <button
                                className={
                                    'btn btn-circle btn-sm btn-primary ' +
                                    (no - 1 === i ? ' shadow' : ' btn-outline')
                                }
                            >
                                {i + 1}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>

            <section className="text-gray-500 px-4">
                <p className="mb-8">
                    {activeQuestion.question}
                </p>

                <div className="grid grid-cols-1 gap-4">
                    {activeQuestion.answerChoices.map((answerChoice) => (
                        <label
                            htmlFor={answerChoice.id}
                            className={
                                'btn' +
                                (
                                    answerChoice.id === answer
                                        ? ' bg-primary-100 hover:bg-primary-100 text-primary border-primary hover:border-primary'
                                        : ' bg-white hover:bg-white text-primary border-white hover:border-primary shadow'
                                )
                            }
                            key={answerChoice.id}
                        >
                            <input
                                type="radio"
                                name="answer"
                                id={answerChoice.id}
                                className="hidden"
                                value={answerChoice.id}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                            {answerChoice.answer}
                        </label>
                    ))}
                </div>
            </section>

            <div className="fixed left-0 bottom-0 z-20 w-screen p-4">
                <button className="btn btn-primary w-full shadow">
                    Jawab
                </button>
            </div>
        </main >
    );
};

EvalutionPage.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers;
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/evaluations/${id}`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const evaluation = await res.json();

    return { props: { evaluation } };
};

export default EvalutionPage;