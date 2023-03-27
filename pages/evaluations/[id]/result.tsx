import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

// Components
import Navbar from '../../../components/Navbar';
import MessageBalloon from '../../../components/MessageBalloon';
import EvaluationAnswer from '../../../components/EvaluationAnswer';

// Utils
import { round10, range } from '../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../types/ComponentWithAuth';
import type { Prisma, Notification } from '@prisma/client';

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
    notifications: Notification[],
};

const EvaluationPage: ComponentWithAuth<Props> = ({ evaluation, notifications }) => {
    // Constant
    const PAGE_TITLE = 'Hasil Evaluasi';

    // Functions
    const showNotifications = () => {
        notifications.map((notification) => {
            toast.success(
                notification.title,
                {
                    toastId: notification.title,
                    onClose: () => {
                        readNotification(notification.id)
                    }
                },
            );
        });
    };

    const readNotification = async (notificationId: string) => {
        try {
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isRead: true,
                }),
            });
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(showNotifications, [notifications]);

    const getMessage = (score: number) => {
        if (score >= 100) {
            return { title: 'Sangat Bagus!', content: 'Kamu sudah sangat paham dengan apa yang telah dipelajari.' };
        } else if (score >= 80) {
            return { title: 'Bagus!', content: 'Kamu sudah paham dengan apa yang telah dipelajari.' };
        } else if (score >= 60) {
            return { title: 'Sedikit Lagi!', content: 'Tingkatkan lagi pemahamanmu.' };
        } else {
            return { title: 'Jangan Menyerah!', content: 'Ingat dan pahami kembali apa yang telah kamu pelajari.' };
        }
    };

    return (
        <main className="flex flex-col bg-base-100 h-screen">
            <Head>
                <title>{PAGE_TITLE} | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <Navbar.Top title={PAGE_TITLE} />

            <div className="flex flex-col h-inherit px-4">
                <section className="flex-grow pb-8">
                    <MessageBalloon
                        color="white"
                        position="b"
                        size="lg"
                        className="h-full shadow-sm shadow-blue-800/10"
                    >
                        <div className="flex flex-col h-full">
                            {/* Stars */}
                            <div className="flex-grow flex flex-col items-center text-center px-4">
                                <div className="rating rating-lg rating-half mt-10 mb-12">
                                    <input type="radio" name="rating-10" className="rating-hidden" checked={!evaluation.score} readOnly />
                                    {range(10).map((i) => (
                                        <input
                                            type="radio"
                                            name="rating-10"
                                            className={
                                                'bg-yellow-400 mask mask-star-2' +
                                                ((i + 1) % 2 ? ' mask-half-1 ml-0.5' : ' mask-half-2 mr-0.5')
                                            }
                                            checked={(i + 1) === (round10(evaluation.score) / 10)}
                                            readOnly
                                            key={i}
                                        />
                                    ))}
                                </div>

                                {/* Score */}
                                <div className="relative mb-9 px-20">
                                    <h1 className="font-bold text-6xl text-gray-800">
                                        {round10(evaluation.score)}
                                    </h1>
                                    <div className="badge absolute top-0 right-0 bg-primary text-white p-4 border-0 rounded-bl-none">
                                        <span className="-mb-0.5">
                                            +{round10(evaluation.score)} XP
                                        </span>
                                    </div>
                                </div>

                                {/* Message */}
                                <h2 className="font-semibold text-lg text-gray-800 mb-2">
                                    {getMessage(round10(evaluation.score)).title}
                                </h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    {getMessage(round10(evaluation.score)).content}
                                </p>

                                <ol className="flex flex-wrap justify-center">
                                    {evaluation.evaluationQuestions.map((evaluationQuestion, i) => (
                                        <li className="p-1" key={evaluationQuestion.question.id}>
                                            <EvaluationAnswer isCorrect={evaluationQuestion.isCorrect || false} no={i + 1} />
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button type="button" className="btn btn-primary btn-block" disabled>
                                    Coba Lagi
                                </button>
                                <Link href="/">
                                    <button type="button" className="btn btn-ghost-primary btn-block">
                                        Ke Beranda
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </MessageBalloon>
                </section>

                <div className="overflow-hidden">
                    <div className="relative h-48 -mb-6 filter drop-shadow-sm">
                        <Image
                            src="/images/geo.svg"
                            alt="Geo"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

EvaluationPage.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers;
    const id = context?.params?.id || null;

    let res;
    res = await fetch(`${process.env.NEXTAUTH_URL}/api/evaluations/${id}`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const evaluation = await res.json();

    res = await fetch(`${process.env.NEXTAUTH_URL}/api/notifications`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const notifications = await res.json();

    return { props: { evaluation, notifications } };
};

export default EvaluationPage;