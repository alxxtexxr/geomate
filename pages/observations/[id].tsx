import { useState } from 'react';
import Router from 'next/router';
// import Image from 'next/image';
// import { Canvas } from '@react-three/fiber';
// import Link from 'next/link';

// Components
import Navbar from '../../components/Navbar';
import ShapePreview from '../../components/ShapePreview';
import Spinner from '../../components/Spinner';


// Utils
import { getShapeByCode } from '../../Utils';

// Constants
import { MATH_SYMBOLS, DEFAULT_SIZE } from '../../Constants';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';
import type { Observation, Evaluation } from '@prisma/client';
import MensurationForm from '../../types/MensurationForm';

type Props = {
    observation: Observation,
    shape: Shape,
};

const ObservationPage: ComponentWithAuth<Props> = ({ observation, shape }) => {
    const baseParams: { [key: number]: string[] } = {
        3: ['baseA', 'baseT'],
        4: ['baseS'],
    };
    const mathSymbolCodes = [
        ...(observation.nBaseVertices ? baseParams[observation.nBaseVertices] : []),
        ...shape.vFormula.split(' '),
        'v'
    ];
    const _mathSymbols = MATH_SYMBOLS.filter((mathSymbol) => mathSymbolCodes.includes(mathSymbol.code));

    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        <main className="relative flex flex-col bg-base-100 texture-base h-screen pb-20">
            {/* <Navbar.Top title="Hasil Observasi" /> */}

            

            <section className="flex flex-col justify-center flex-grow px-4 text-sm">
                <div className="text-center px-4 mb-6">
                    <h1 className="font-semibold text-gray-800 text-lg mb-1">
                        Pengamatan Selesai!
                    </h1>
                    <p className="text-sm text-gray-600">
                        Dari pengamatan yang telah dilakukan, diketahui volume air yang diperlukan untuk memenuhi toples yaitu <span className="font-medium text-gray-800">1178.1 cm3</span>
                    </p>
                </div>

                <div className="bg-white p-2 shadow rounded-2xl overflow-hidden">
                    <div className="bg-black rounded-xl overflow-hidden">
                        <ShapePreview
                            shapeCode={shape.code}
                            mensurationForm={observation as unknown as MensurationForm}
                        />
                    </div>
                    <div className="pt-2 px-2">
                        {_mathSymbols.map((mathSymbol, i) => (
                            <div className={
                                'flex justify-between items-center py-2 border-gray-100' +
                                (i + 1 < _mathSymbols.length ? '  border-b' : '')
                            } key={mathSymbol.code}>
                                <div className="w-7/12">
                                    <div className="badge badge-primary badge-outline text-xs font-semibold w-8 mr-2 -mt-0.5">
                                        {mathSymbol.symbol}
                                    </div>
                                    {mathSymbol.title}
                                </div>

                                <span className="font-medium text-gray-800">
                                    {(observation as { [key: string]: any })[mathSymbol.code] || 0} {mathSymbol.code === 'v' ? 'cm³' : (mathSymbol.code === 'la' ? 'cm²' : 'cm')}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
            
            <section className="fixed left-0 bottom-0 w-screen p-4">
                {/* <Link href="/">
                    <button className="btn btn-primary btn-outline w-full">
                        Selesai
                    </button>
                </Link> */}
                {isLoading ? (
                    <button className="btn w-full" disabled>
                        <Spinner />
                    </button>
                ) : (
                    <button className="btn btn-primary w-full shadow" onClick={startEvaluation}>
                        Evaluasi
                    </button>
                )}
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
    const shape = getShapeByCode(observation.shapeCode);

    return { props: { observation, shape } };
};

export default ObservationPage;