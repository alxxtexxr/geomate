import { useState } from 'react';
import Router from 'next/router';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import Link from 'next/link';

// Components
import Navbar from '../../components/Navbar';
import ShapeComponent from '../../components/Shape';
import Spinner from '../../components/Spinner';

// Utils
import { getShapeByCodename } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';
import type { Observation, Evaluation } from '@prisma/client';

// Constants
import { MATH_SYMBOLS } from '../../Constants';

type Props = {
    observation: Observation,
    shape: Shape,
};

const ObservationPage: ComponentWithAuth<Props> = ({ observation, shape }) => {
    const _mathSymbols = MATH_SYMBOLS.filter(({ symbol }) => (shape.vFormula + shape.lpFormula + 'V' + 'LP').includes(symbol));

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const startEvaluation = async () => {
        setIsLoading(true);

        try {
            const body = {
                shapeCodename: shape.codename,
            };

            const res = await fetch(`/api/evaluations/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const evaluation: Evaluation = await res.json();

            await Router.push(`/evaluations/${evaluation.id}`);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main className="relative flex flex-col bg-base-100 h-screen pb-20">
            <Navbar title="Hasil Observasi" />

            {observation.image && (
                <section className="px-4 mb-4">
                    <div className="relative inline-flex bg-white w-full p-2 rounded-xl shadow overflow-hidden">
                        <div className="relative h-60 w-full">
                            <Image
                                src={observation.image}
                                alt="Stimulasi"
                                className="rounded-lg"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div className="absolute right-0 bottom-0 bg-white h-20 w-20 rounded-tl-xl">
                            <Canvas>
                                <ambientLight color="#888888" />
                                <pointLight position={[10, 20, 0]} />
                                <ShapeComponent
                                    codename={shape.codename}
                                    {...observation}
                                    r={(observation.r || 20) / 10}
                                    t={(observation.t || 20) / 10}
                                />
                            </Canvas>
                        </div>
                    </div>
                </section>
            )}

            <section className="flex-grow bg-white text-gray-500 p-4 text-sm rounded-t-xl shadow">
                {_mathSymbols.map(({ symbol, title }, i) => (
                    <div className={
                        'flex justify-between items-center py-4 border-gray-100' +
                        (i + 1 < _mathSymbols.length ? '  border-b' : '')
                    } key={symbol}>
                        <div className="w-7/12">
                            {title} ({symbol})
                        </div>
                        {/* <div className="w-5/12"> */}
                        <span className="font-semibold text-gray-800">
                            {(observation as { [key: string]: any })[symbol.toLowerCase()] || 0} {symbol === 'V' ? 'cm³' : (symbol === 'LP' ? 'cm²' : 'cm')}
                        </span>
                        {/* <label className="input-group">
                                <input
                                    type="text"
                                    className="input input-bordered w-1 flex-grow"
                                    value={(observation as { [key: string]: any })[symbol.toLowerCase()] || 0}
                                    disabled
                                />
                                <span className="font-semibold" style={{ width: 60 }}>{symbol === 'V' ? 'cm³' : (symbol === 'LP' ? 'cm²' : 'cm')}</span>
                            </label> */}
                    </div>
                    // </div>
                ))}
            </section>

            <section className="fixed left-0 bottom-0 grid grid-cols-2 gap-4 bg-white w-screen p-4 shadow">

                {isLoading ? (
                    <button className="btn w-full" disabled>
                        <Spinner />
                    </button>
                ) : (
                    <button className="btn btn-primary w-full" onClick={startEvaluation}>
                        Evaluasi
                    </button>
                )}
                <Link href="/">
                    <button className="btn btn-primary btn-outline w-full">
                        Selesai
                    </button>
                </Link>
            </section>
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
    const shape = getShapeByCodename(observation.shapeCodename);

    return { props: { observation, shape } };
};

export default ObservationPage;