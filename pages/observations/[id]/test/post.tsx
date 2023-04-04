import { useState } from 'react';
import Router from 'next/router';
import { Prisma } from '@prisma/client'

// Components
import Navbar from '../../../../components/Navbar';
import { AnswerChoices } from '../../../../components/EvaluationQuestion';
import LoadingButton from '../../../../components/Loading/LoadingButton';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../../types/ComponentWithAuth';

type Observation = Prisma.ObservationGetPayload<{
    include: {
        postTestQuestion: {
            select: {
                question: true,
                image: true,
                answerChoices: true,
            },
        },
    },
}>;

type Props = {
    observation: Observation,
};

// The page should check if 'isPostTestCorrect' column is filled or not
// If it's filled, then it should be redirected to post-test result page
const PostTest: ComponentWithAuth<Props> = ({ observation }) => {
    // States
    const [answer, setAnswer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Function
    const answerQuestion = async () => {
        setIsLoading(true)

        try {
            await fetch(`/api/observations/${observation.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postTestAnswer: answer }),
            });

            await Router.push(`/observations/${observation.id}/test/post/result`);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main className="flex flex-col bg-base-100 h-screen w-inherit">
            <Navbar.Top title="Latihan" />

            <div className="flex-grow">
                <section className="px-4">
                    <p className="text-gray-600 text-sm mb-6">
                        {observation.postTestQuestion.question}
                    </p>

                    <AnswerChoices
                        answerChoices={observation.postTestQuestion.answerChoices}
                        answer={answer}
                        setAnswer={setAnswer}
                    />
                </section>
            </div>

            <div className="fixed bottom-0 w-inherit grid grid-cols-1 gap-2 bg-white bg-opacity-95 p-4 rounded-t-2xl shadow-md shadow-blue-800/10">
                {isLoading ? (<LoadingButton />) : (
                    <button
                        type="button"
                        className="btn btn-primary w-full"
                        {...(answer ? {
                            // Handle button click if the question is answered
                            onClick: answerQuestion
                        } : {
                            // Disable button if the question isn't answered yet
                            disabled: true,
                        })}
                    >
                        Jawab
                    </button>
                )}
            </div>
        </main >
    );
};

PostTest.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers;
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/observations/${id}`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const observation = await res.json();

    return { props: { observation } };
};

export default PostTest;