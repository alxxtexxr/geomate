import Image from 'next/image';
import Link from 'next/link';

// Components
import Navbar from '../../components/Navbar';

// Utils
import { getShapeByCodename } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';

type Props = {
    shape: Shape,
};

const Stimulation: ComponentWithAuth<Props> = ({ shape }) => {
    return (
        <main className="bg-base-100 flex flex-col h-screen">
            <Navbar title="Stimulus" backHref="/" />

            <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
                <div className="bg-white p-2 mb-8 rounded-xl shadow">
                    <div className="relative w-60 h-48">
                        <Image
                            src={shape.stimulationImage}
                            alt="Stimulasi"
                            className="rounded-lg"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>

                <h1 className="font-semibold text-black text-opacity-90">{shape.stimulation}</h1>
            </section>

            <section className="p-4">
                <Link href={`/problem-identification/${shape.codename}`}>
                    <button className="btn btn-primary w-full">SELANJUTNYA</button>
                </Link>
            </section>
        </main>
    );
};

Stimulation.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shapeCodename = context?.params?.shapeCodename || null;
    const shape = shapeCodename ? getShapeByCodename(shapeCodename as string) : null;

    return { props: { shape } };
};

export default Stimulation;