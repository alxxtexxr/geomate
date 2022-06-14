import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Prisma } from '@prisma/client'

// Components
import Navbar from '../../../../components/Navbar';
import Spinner from '../../../../components/Spinner';
import EvaluationQuestion from '../../../../components/EvaluationQuestion';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../../types/ComponentWithAuth';

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

const EvaluationQuestionPage: ComponentWithAuth<Props> = ({ evaluation }) => {
    // Router
    const router = useRouter();

    const no = router.query.no ? +router.query.no : 1;
    const activeEvaluationQuestion = evaluation.evaluationQuestions[no - 1];
    const activeQuestion = activeEvaluationQuestion.question;

    // States
    const [answer, setAnswer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Effects
    useEffect(() => {
        setAnswer(activeEvaluationQuestion.answer)
    }, [router]);

    // Functions
    const answerQuestion = async () => {
        setIsLoading(true)

        try {
            await fetch(`/api/evaluation-questions/${evaluation.id}/${activeQuestion.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer: answer }),
            });

            if (no < evaluation.evaluationQuestions.length) {
                setIsLoading(false);
                setAnswer(null);

                await router.push({
                    pathname: '/evaluations/[id]/no/[no]',
                    query: { id: evaluation.id, no: no + 1 },
                });
            } else {
                // If last question
                await fetch(`/api/evaluations/${evaluation.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isCompleted: true }),
                });

                await router.push({
                    pathname: '/evaluations/[id]',
                    query: { id: evaluation.id },
                });
            }
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main>
            <Navbar title="Evaluasi" />

            <EvaluationQuestion.Pagination
                evaluationQuestions={evaluation.evaluationQuestions}
                no={no}
            />

            <section className="text-gray-500 px-4">
                <p className="mb-8">
                    {activeQuestion.question}
                </p>

                <div className="grid grid-cols-1 gap-4">
                    {activeQuestion.answerChoices.map((answerChoice, i) => (
                        <label
                            htmlFor={answerChoice.id}
                            className={
                                'btn justify-start font-normal normal-case' +
                                (
                                    answerChoice.id === answer
                                        ? ' bg-primary hover:bg-primary bg-opacity-5 hover:bg-opacity-5 text-primary border-primary hover:border-primary'
                                        : ' bg-white hover:bg-white text-gray-500 border-white hover:border-primary shadow'
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
                            <span className={
                                'badge text-primary h-8 w-8 mr-4 border-none' +
                                (
                                    answerChoice.id !== answer
                                        ? ' bg-primary bg-opacity-20'
                                        : ''
                                )
                            }>
                                {['A', 'B', 'C', 'D'][i]}
                            </span>
                            {answerChoice.answer}
                        </label>
                    ))}
                </div>
            </section>

            <section className="fixed left-0 bottom-0 z-20 w-screen p-4">
                {/* Jika telah menjawab semua baru bisa mengumpul jawaban */}

                {answer ? (
                    isLoading ? (
                        <button className="btn w-full" disabled>
                            <Spinner />
                        </button>
                    ) : (
                        <button className="btn btn-primary w-full shadow" onClick={answerQuestion}>
                            {no < evaluation.evaluationQuestions.length ? 'Jawab' : 'Kumpulkan Jawaban'}
                        </button>
                    )
                ) : (
                    <button className="btn w-full" disabled>
                        {no < evaluation.evaluationQuestions.length ? 'Jawab' : 'Kumpulkan Jawaban'}
                    </button>
                )}
            </section>
        </main >
    );
};

EvaluationQuestionPage.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers;
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/evaluations/${id}`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const evaluation = await res.json();

    return { props: { evaluation } };
};

export default EvaluationQuestionPage;