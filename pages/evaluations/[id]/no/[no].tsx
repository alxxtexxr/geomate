import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Prisma } from '@prisma/client'

// Components
import Navbar from '../../../../components/Navbar';
import { Pagination, AnswerChoices } from '../../../../components/EvaluationQuestion';
import LoadingButton from '../../../../components/Loading/LoadingButton';

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
                    },
                },
            },
        },
    },
}>;

type Props = {
    evaluation: Evaluation,
};

const EvaluationQuestionPage: ComponentWithAuth<Props> = ({ evaluation }) => {
    console.log({ evaluation })
    // Router
    const router = useRouter();

    const no = router.query.no ? +router.query.no : 1;
    const activeEvaluationQuestion = evaluation.evaluationQuestions[no - 1];
    const activeQuestion = activeEvaluationQuestion.question;

    // States
    const [answer, setAnswer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Effects
    useEffect(() => setAnswer(activeEvaluationQuestion.answer), [activeEvaluationQuestion.answer]);

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
                    pathname: '/evaluations/[id]/result',
                    query: { id: evaluation.id },
                });
            }
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main className="flex flex-col bg-base-100 h-screen">
            <Navbar.Top title="Evaluasi" />

            <div className="flex-grow">
                <Pagination
                    evaluationQuestions={evaluation.evaluationQuestions}
                    no={no}
                />

                <section className="px-4">
                    <p className="text-gray-600 text-sm mb-6">
                        {activeQuestion.question}
                    </p>

                    <AnswerChoices
                        answerChoices={activeQuestion.answerChoices}
                        answer={answer}
                        setAnswer={setAnswer}
                    />
                </section>
            </div>

            <div className="left-0 bottom-0 z-20 w-inherit p-4">
                {isLoading && (<LoadingButton />)}
                {!isLoading && (
                    no < evaluation.evaluationQuestions.length ? (
                        answer ? (
                            <button className="btn btn-primary w-full" onClick={answerQuestion}>
                                Jawab
                            </button>
                        ) : (
                            <button className="btn w-full" disabled>
                                Jawab
                            </button>
                        )
                    ) : (
                        // Check whether every evaluation question (except the last one) is answered or not
                        answer && evaluation.evaluationQuestions.slice(0, 1).every((evaluationQuestion) => evaluationQuestion.answer) ? (
                            <button className="btn btn-primary w-full" onClick={answerQuestion}>
                                {/* Kumpulkan Jawaban */}
                                Selesai
                            </button>
                        ) : (
                            <button className="btn w-full" disabled>
                                {answer ? 'Selesai' : 'Jawab'}
                            </button>
                        )
                    )
                )}


            </div>
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