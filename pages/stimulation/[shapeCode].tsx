import Image from 'next/image';
import Link from 'next/link';

// Components
import Navbar from '../../components/Navbar';

// Utils
import { getShapeByCode } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';

type Props = {
    shape: Shape,
};

const Stimulation: ComponentWithAuth<Props> = ({ shape }) => {
    return (
        <main className="flex flex-col h-screen texture-base">
            <Navbar.Top title="Stimulus" backHref="/" />

            <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
                <div className="bg-white p-2 mb-6 rounded-2xl shadow">
                    <div className="relative w-72 h-48">
                        <Image
                            src={shape.stimulationImage}
                            alt="Stimulasi"
                            className="rounded-xl"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>

                <h1 className="text-sm text-gray-600">
                    {shape.stimulation}
                </h1>
            </section>

            <section className="p-4">
                <Link href={`/problem-identification/${shape.code}`}>
                    <button className="btn btn-primary w-full">SELANJUTNYA</button>
                </Link>
            </section>
        </main>
    );
};

Stimulation.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shapeCode = context?.params?.shapeCode || null;
    const shape = shapeCode ? getShapeByCode(shapeCode as string) : null;

    return { props: { shape } };
};

export default Stimulation;