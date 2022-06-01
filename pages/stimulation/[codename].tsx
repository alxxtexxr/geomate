import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import Shape from '../../types/Shape';

import Navbar from '../../components/Navbar';

type Props = {
    shape: Shape,
};

const Stimulation: React.FC<Props> = ({ shape }) => {
    return (
        <main className="bg-base-200 flex flex-col h-screen">
            <Navbar backHref="/" />

            <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
                <div className="bg-base-100 p-2 mb-8 rounded-xl shadow">
                    <div className="relative h-60 w-60">
                        <Image
                            src={shape.stimulationImage}
                            alt="Stimulasi"
                            className="rounded-lg"
                            layout="fill"
                        />
                    </div>
                </div>

                <h1 className="font-bold">{shape.stimulation}</h1>
            </section>

            <section className="p-4">
                <Link href={`/problem-identification/${shape.codename}`}>
                    <button className="btn btn-primary w-full">SELANJUTNYA</button>
                </Link>
            </section>
        </main>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shapeCodename = context?.params?.codename || 0;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/shapes/${shapeCodename}`);
    const shape = await res.json();

    return {
        props: { shape },
    };
};

export default Stimulation;