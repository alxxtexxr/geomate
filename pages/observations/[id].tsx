import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import Link from 'next/link';

// Components
import ShapeComponent from '../../components/Shape';

// Utils
import { getShapeByCodename } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';
import type Observation from '../../types/Observation';

// Constants
import { MATH_SYMBOLS } from '../../Constants';

type Props = {
    observation: Observation,
    shape: Shape,
};

const ObservationPage: ComponentWithAuth<Props> = ({ observation, shape }) => {
    // Animate the 3D model
    const [{ rotation }] = useSpring(() => ({
        rotation: [0, 0, 0],
        config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
    }))


    return (
        <main className="relative flex flex-col bg-base-200 h-screen pb-20">
            {/* <Navbar title="Hasil Observasi" /> */}

            {/* <section> */}
            <div className="p-4">
                <div className="relative inline-flex bg-base-100 w-full p-2 rounded-xl shadow overflow-hidden">
                    <div className="relative h-60 w-full">
                        <Image
                            src="/images/placeholder-image.jpeg"
                            alt="Stimulasi"
                            className="rounded-lg"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="absolute right-0 bottom-0 bg-base-100 h-20 w-20 rounded-tl-xl">
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
            </div>

            <div className="flex-grow bg-base-100 p-4 text-sm rounded-t-xl shadow">
                {MATH_SYMBOLS.map(({ symbol, title }, i) => (shape.vFormula + shape.lpFormula + 'V' + 'LP').includes(symbol) && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <div className="w-7/12">
                            {title} ({symbol})
                        </div>
                        {/* <div className="w-5/12"> */}
                        <span className="font-semibold">
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
            </div>
            {/* </section> */}

            <section className="fixed left-0 bottom-0 grid grid-cols-2 gap-4 bg-white w-screen p-4 shadow">
                <button className="btn btn-primary w-full">
                    Evaluasi
                </button>
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
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/observations/${id}`);
    const observation = await res.json();
    const shape = getShapeByCodename(observation.shapeCodename);

    return { props: { observation, shape } };
};

export default ObservationPage;