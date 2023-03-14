import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// Components
import Navbar from '../../components/Navbar';
import MessageBalloon from '../../components/MessageBalloon';

// Utils
import { getShape } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';

type Props = {
    shape: Shape,
};

const Initiation: ComponentWithAuth<Props> = ({ shape }) => {
    return (
        <main className="relative flex flex-col bg-base-100 h-screen">
            <Head>
                <title>{shape.name} | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <Navbar.Top title={shape.name} backHref="/" />

            <div className="flex flex-col h-inherit px-4 pb-4">
                <div className="flex-grow pb-8">
                    <MessageBalloon
                        color="white"
                        position="bl"
                        size="lg"
                        className="h-full"
                    >
                        <div className="relative w-full aspect-4/3 mb-4">
                            <Image
                                src={shape.stimulationImage}
                                alt="Stimulasi"
                                className="rounded-lg"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <p className="text-gray-600">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo. Mattis pellentesque id nibh tortor.
                        </p>
                    </MessageBalloon>
                </div>

                <div className="grid grid-cols-2 gap-4 px-4 pb-4">
                    <div
                        className="relative h-44"
                    // style={{ filter: 'drop-shadow(0px 1px 3px rgba(199, 210, 254, 0.2)) drop-shadow(0px 1px 2px rgba(199, 210, 254, 0.2))' }}
                    >
                        <Image
                            src="/images/geo.svg"
                            alt="Stimulasi"
                            className="rounded-lg"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-xs text-gray-600 text-center mb-4">Apakah kamu sudah paham?</p>
                        <button className="btn btn-primary btn-sm w-32 mb-2">Sudah</button>
                        <button className="btn btn-primary btn-ghost btn-sm bg-white text-primary hover:bg-primary hover:text-white w-32">Kembali</button>
                    </div>
                </div>
            </div>

            {/* <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
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
            </section> */}

            {/* <section className="p-4">
                <Link href={`/problem-identification/${shape.code}`}>
                    <button className="btn btn-primary w-full">SELANJUTNYA</button>
                </Link>
            </section> */}
        </main>
    );
};

Initiation.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shapeCode = context?.params?.shapeCode || null;
    const shape = shapeCode ? getShape(shapeCode as string) : null;

    return { props: { shape } };
};

export default Initiation;