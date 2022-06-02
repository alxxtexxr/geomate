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

const ProblemIdentification: ComponentWithAuth<Props> = ({ shape }) => {
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

                <h1 className="font-semibold">{shape.problemIdentification}</h1>
            </section>

            <section className="p-4">
                <Link href={`/classification/${shape.codename}`}>
                    <button className="btn btn-primary w-full">MULAI OBSERVASI</button>
                </Link>
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