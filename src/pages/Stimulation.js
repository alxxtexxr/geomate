import { Link, useParams } from 'react-router-dom';

import Navbar from '../components/Navbar';

const Stimulation = () => {
    let { shapeCodename } = useParams();

    return (
        <main className="bg-base-200 flex flex-col h-screen">
            <Navbar backLinkTo="/" />
            <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
                <div className="bg-base-100 p-2 mb-8 rounded-xl shadow">
                    <img
                        src="https://api.lorem.space/image/furniture?w=240&h=240"
                        alt="Stimulation"
                        className="rounded-lg"
                    />
                </div>

                <h1 className="font-bold">Tahukah Kamu?</h1>
            </section>

            <section className="p-4">
                <Link to={`/problem-identification/${shapeCodename}`}>
                    <button className="btn btn-primary w-full">SELANJUTNYA</button>
                </Link>
            </section>
        </main>
    );
};

export default Stimulation;