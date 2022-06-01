import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import Shape from '../../types/Shape';

import Navbar from '../../components/Navbar';

type Props = {
    shape: Shape,
};

const ProblemIdentification: React.FC<Props> = ({ shape }) => {
    return (
        <main className="bg-base-200 flex flex-col h-screen">
            <Navbar backHref={`/stimulation/${shape.codename}`} />

            <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
                <div className="bg-base-100 p-2 mb-8 rounded-xl shadow">
                    <div className="relative h-60 w-60">
                        <Image
                            src={shape.problemIdentificationImage}
                            alt="Stimulasi"
                            className="rounded-lg"
                            layout="fill"
                        />
                    </div>
                </div>

                <h1 className="font-bold">{shape.problemIdentification}</h1>
            </section>

            <section className="p-4">
                <Link href={`/classification/${shape.codename}`}>
                    <button className="btn btn-primary w-full">MULAI OBSERVASI</button>
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

export default ProblemIdentification;