import { useState } from 'react';
import Image from 'next/image';
import Router from 'next/router';

// Components
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';

// Utils
import { getShapeByCode } from '../../Utils';

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

            await Router.push(`/observations/${observation.id}/classification`);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main className="flex flex-col h-screen">
            <Navbar.Top title="Pernyataan Masalah" backHref={`/stimulation/${shape.code}`} />

            <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
                <div className="bg-white p-2 mb-8 rounded-xl shadow">
                    <div className="relative w-60 h-48">
                        <Image
                            src={shape.problemIdentificationImage}
                            alt="Stimulasi"
                            className="rounded-lg"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>

                <h1 className="font-medium text-gray-800">
                    {shape.problemIdentification}
                </h1>
            </section>

            <section className="p-4">
                {isLoading ? (
                    <button className="btn w-full" disabled>
                        <Spinner />
                    </button>
                ) : (
                    <button className="btn btn-primary w-full" onClick={startObservation}>
                        Mulai Observasi
                    </button>
                )}
            </section>
        </main>
    );
};

ProblemIdentification.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shapeCode = context?.params?.shapeCode || null;
    const shape = shapeCode ? getShapeByCode(shapeCode as string) : null;

    return { props: { shape } };
};

export default ProblemIdentification;