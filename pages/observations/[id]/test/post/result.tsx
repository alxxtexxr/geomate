import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// Components
import Navbar from '../../../../../components/Navbar';
import MessageBalloon from '../../../../../components/MessageBalloon';
import Formula from '../../../../../components/Formula';

// Utils
import { getShape, formatFormula } from '../../../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../../../types/ComponentWithAuth';
import type Shape from '../../../../../types/Shape';
import type { Observation } from '@prisma/client';

type Props = {
    observation: Observation,
    shape: Shape,
};

const PostTestResult: ComponentWithAuth<Props> = ({ observation, shape }) => (
    <main className="flex flex-col bg-base-100 min-h-screen">
        <Head>
            <title>Hasil Latihan | {process.env.NEXT_PUBLIC_APP_NAME}</title>
        </Head>

        <Navbar.Top title="Hasil Latihan" />

        <div className="flex flex-grow flex-col px-4">
            <section className="flex flex-grow pb-8">
                <MessageBalloon
                    color="white"
                    position="b"
                    size="lg"
                    className="flex-grow shadow-sm shadow-blue-800/10"
                >
                    <div className="flex flex-col h-full">
                        <div className="flex flex-grow flex-col justify-center items-center text-center px-4">
                            <div className={'relative w-48 h-48 mb-8' + (!observation.isPostTestCorrect ? ' grayscale' : '')}>
                                <img src="https://cdn-icons-png.flaticon.com/512/3083/3083645.png" />
                            </div>
                            <h2 className="text-gray-800 text-lg font-semibold mb-2">
                                {observation.isPostTestCorrect
                                    ? 'Latihanmu Selesai!'
                                    : 'Yuk, Kita Coba Lagi!'}
                            </h2>
                            <p className="text-gray-600 text-sm mb-6">
                                {observation.isPostTestCorrect
                                    ? 'Kamu berhasil menjawab soal latihan dengan benar. Ini menunjukkan bahwa kamu sudah paham cara menggunakan rumus yang telah kamu pelajari.'
                                    : 'Kamu belum berhasil menjawab soal latihan dengan benar, tapi jangan khawatir kita bisa mencobanya lagi.'}
                            </p>
                        </div>

                        {observation.isPostTestCorrect ? (
                            <Link href="/">
                                <button type="button" className="btn btn-primary btn-block">
                                    Kembali Ke Beranda
                                </button>
                            </Link>
                        ) : (
                            <Link href={`/observations/${observation.id}/test/post`}>
                                <button type="button" className="btn btn-error btn-block text-white">
                                    Coba Lagi
                                </button>
                            </Link>
                        )}
                    </div>
                </MessageBalloon>
            </section>

            <div className="overflow-hidden">
                <div className="relative h-48 -mb-6 filter drop-shadow-md-blue-800">
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

PostTestResult.auth = true;

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

export default PostTestResult;