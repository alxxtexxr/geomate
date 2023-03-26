import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Router from 'next/router';
// import { MdCheck, MdOutlineKeyboardBackspace } from 'react-icons/md';

// Components
import Navbar from '../../components/Navbar';
import MessageBalloon from '../../components/MessageBalloon';
import Loading from '../../components/Loading';

// Utils
import { getShape } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type { Observation } from '@prisma/client';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';

type Props = {
    shape: Shape,
};

const Initiation: ComponentWithAuth<Props> = ({ shape }) => {
    const [initiationI, setInitiationI] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const startObservation = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`/api/observations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shapeCode: shape.code,
                }),
            });
            const observation: Observation = await res.json();

            await Router.push(`/observations/${observation.id}/steps/1`);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main className="relative flex flex-col bg-base-100 h-screen">
            <Head>
                <title>{shape.name} | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <Navbar.Top title={shape.name} backHref="/" />

            <div className="flex flex-col h-inherit px-4">
                <section className="flex-grow pb-8">
                    <MessageBalloon
                        color="white"
                        position="b"
                        size="lg"
                        className="h-full shadow-sm shadow-blue-800/10"
                    >
                        <div className="flex flex-col h-full">
                            <div className="relative bg-gray-200 w-full aspect-4/3 rounded-lg" />

                            <div className="flex flex-grow justify-center items-center text-center px-4">
                                <p className="text-gray-800 font-medium">
                                    {shape.initiation[initiationI].content}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    className="btn btn-ghost-primary"
                                    {...(!initiationI ? {
                                        disabled: true,
                                    } : {
                                        onClick: () => setInitiationI(initiationI - 1)
                                    })}
                                >
                                    Kembali
                                </button>

                                {isLoading ? (
                                    <Loading.Button />
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-block"
                                        onClick={
                                            () =>
                                                initiationI + 1 < shape.initiation.length
                                                    ? setInitiationI(initiationI + 1)
                                                    : startObservation()
                                        }
                                    >

                                        {initiationI + 1 < shape.initiation.length ? 'Lanjut' : 'Observasi'}
                                    </button>
                                )}
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
            </div >
        </main >
    );
};

Initiation.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shapeCode = context?.params?.shapeCode || null;
    const shape = shapeCode ? getShape(shapeCode as string) : null;

    return { props: { shape } };
};

export default Initiation;