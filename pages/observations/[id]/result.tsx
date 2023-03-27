import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Router from 'next/router';

// Components
import Navbar from '../../../components/Navbar';
import MessageBalloon from '../../../components/MessageBalloon';
import Formula from '../../../components/Formula';
import Loading from '../../../components/Loading';

// Utils
import { getShape, formatFormula } from '../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../types/ComponentWithAuth';
import type Shape from '../../../types/Shape';
import type { Observation, Evaluation } from '@prisma/client';

type Props = {
    observation: Observation,
    shape: Shape,
};

const ObservationPage: ComponentWithAuth<Props> = ({ observation, shape }) => {
    // State
    const [isLoading, setIsLoading] = useState(false);

    // Function
    const startEvaluation = async () => {
        setIsLoading(true);

        try {
            const body = {
                shapeCode: shape.code,
            };

            const res = await fetch(`/api/evaluations/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const evaluation: Evaluation = await res.json();

            await Router.push(`/evaluations/${evaluation.id}/no/1`);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main className="flex flex-col bg-base-100 min-h-screen">
            <Head>
                <title>Hasil Observasi | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <Navbar.Top title="Hasil Observasi" />

            <div className="flex flex-grow flex-col px-4">
                <section className="flex flex-grow pb-8">
                    <MessageBalloon
                        color="white"
                        position="b"
                        size="lg"
                        className="flex-grow shadow-sm shadow-blue-800/10"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex flex-grow flex-col items-center text-center px-4">
                                <div className="relative w-36 h-36 mt-10 mb-10">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/9436/9436122.png"
                                    />
                                </div>
                                <h2 className="text-gray-800 text-lg font-semibold mb-2">
                                    Observasi Selesai!
                                </h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    Kamu telah berhasil mempelajari volume {shape.name.toLowerCase()}. Selanjutnya, kamu dapat menguji pengetahuannmu melalui evaluasi.
                                </p>
                                <Formula type="primary" className="mb-8">
                                    Volume = {formatFormula(shape.vFormula)}
                                </Formula>
                            </div>

                            {isLoading ? (
                                <Loading.Button />
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    onClick={startEvaluation}
                                >
                                    Evaluasi
                                </button>
                            )}
                        </div>
                    </MessageBalloon>
                </section>

                <div className="overflow-hidden">
                    <div className="relative h-48 -mb-6 filter drop-shadow-md">
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

ObservationPage.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers;
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/observations/${id}`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const observation = await res.json();
    const shape = getShape(observation.shapeCode);

    return { props: { observation, shape } };
};

export default ObservationPage;