import { useState } from 'react';
import Image from 'next/image';
import Router from 'next/router';

// Components
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';

// Utils
import { getShapeByCodename } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';
import type Observation from '../../types/Observation';

type Props = {
    shape: Shape,
};

const ProblemIdentification: ComponentWithAuth<Props> = ({ shape }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createObservation = async () => {
        setIsLoading(true);

        try {
            const body = {
                shapeCodename: shape.codename,
            };

            const res = await fetch(`/api/observations/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const observation: Observation = await res.json();

            await Router.push(`/observations/${observation.id}/classification`);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main className="bg-base-100 flex flex-col h-screen">
            <Navbar title="Pernyataan Masalah" backHref={`/stimulation/${shape.codename}`} />

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

                <h1 className="font-semibold text-gray-800">
                    {shape.problemIdentification}
                </h1>
            </section>

            <section className="p-4">
                {isLoading ? (
                    <button className="btn w-full" disabled>
                        <Spinner />
                    </button>
                ) : (
                    <button className="btn btn-primary w-full" onClick={createObservation}>
                        Mulai Observasi
                    </button>
                )}
            </section>
        </main>
    );
};

ProblemIdentification.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const codename = context?.params?.codename || null;
    const shape = codename ? getShapeByCodename(codename as string) : null;

    return { props: { shape } };
};

export default ProblemIdentification;