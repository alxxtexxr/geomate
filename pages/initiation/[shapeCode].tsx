import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
// import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Components
import Navbar from '../../components/Navbar';
import MessageBalloon from '../../components/MessageBalloon';

// Utils
import { getShape } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';

type Props = {
    shape: Shape,
};

const Initiation: ComponentWithAuth<Props> = ({ shape }) => {
    const [initiationI, setInitiationI] = useState(0)

    return (
        <main className="relative flex flex-col bg-base-100 h-screen">
            <Head>
                <title>{shape.name} | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <Navbar.Top title={shape.name} backHref="/" />

            <div className="flex flex-col h-inherit px-4 pb-4">
                <section className="flex-grow pb-8">
                    <MessageBalloon
                        color="white"
                        position="bl"
                        size="lg"
                        className="h-full shadow-sm shadow-blue-800/10"
                    >
                        <div className="relative bg-gray-200 w-full aspect-4/3 mb-4 rounded-lg" />
                        <p className="text-gray-600">
                            {shape.initiation[initiationI].content}
                        </p>
                    </MessageBalloon>
                </section>

                <section className="grid grid-cols-2 gap-4 px-4 pb-4">
                    <div className="relative h-44">
                        <Image
                            src="/images/geo.svg"
                            alt="Geo"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-600 text-center mb-4">
                            {initiationI+1 < shape.initiation.length ? 'Sudah paham belum?' : 'Siap mulai observasi?'}
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm w-32 mb-2 shadow-sm shadow-blue-800/10"
                            onClick={() => setInitiationI(initiationI + 1)}
                        >
                            {initiationI+1 < shape.initiation.length ? 'Sudah' : 'Siap Mulai'}
                        </button>
                        {initiationI > 0 && (
                            <button
                                type="button"
                                className="btn btn-primary btn-ghost btn-sm bg-white text-primary hover:bg-primary hover:text-white w-32 shadow-sm shadow-blue-800/10"
                                onClick={() => setInitiationI(initiationI - 1)}
                            >
                                Kembali
                            </button>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

Initiation.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shapeCode = context?.params?.shapeCode || null;
    const shape = shapeCode ? getShape(shapeCode as string) : null;

    return { props: { shape } };
};

export default Initiation;