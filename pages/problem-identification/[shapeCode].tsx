import { useState } from 'react';
import Image from 'next/image';
import Router from 'next/router';

// Components
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';

// Utils
import { getShape } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';
import type { Observation } from '@prisma/client';

type Props = {
    shape: Shape,
};

const ProblemIdentification: ComponentWithAuth<Props> = ({ shape }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const startObservation = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`/api/observations/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shapeCode: shape.code,
                }),
            });
            const observation: Observation = await res.json();

            await Router.push(`/observations/${observation.id}/mensuration`);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main className="flex flex-col bg-base-100  h-screen">
            <Navbar.Top title="Pernyataan Masalah" backHref={`/stimulation/${shape.code}`} />

            <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
                <div className="bg-white p-2 mb-6 rounded-2xl shadow">
                    <div className="relative w-72 h-48">
                        <Image
                            src={shape.problemIdentificationImage}
                            alt="Stimulasi"
                            className="rounded-xl"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>

                <h1 className="text-sm text-gray-600">
                    {shape.problemIdentification}
                </h1>
            </section>

            <section className="p-4">
                {isLoading ? (
                    <button className="btn w-full" disabled>
                        <Loading.Spinner />
                    </button>
                ) : (
                    <button className="btn btn-primary w-full" onClick={startObservation}>
                        Mulai Amati
                    </button>
                )}
            </section>
        </main>
    );
};

ProblemIdentification.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shapeCode = context?.params?.shapeCode || null;
    const shape = shapeCode ? getShape(shapeCode as string) : null;

    return { props: { shape } };
};

export default ProblemIdentification;