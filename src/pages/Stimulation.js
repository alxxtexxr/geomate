import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';

const Stimulation = () => (
    <main className="bg-base-200 flex flex-col h-screen">
        <Navbar backLinkTo="/" />
        <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
            {/* <img src={require('../assets/images/logic.svg').default} alt="" className="w-48 mb-8" /> */}
            <div className="bg-base-100 p-2 mb-8 rounded-xl shadow">
                <img
                    src="https://api.lorem.space/image/furniture?w=240&h=240"
                    alt="Stimulation"
                    className="rounded-lg"
                />
            </div>

            <h1 className="font-bold">Ini teks untuk stimulus?</h1>
        </section>

        <section className="p-4">
            <Link to="/problem-identification">
                <button className="btn btn-primary w-full">SELANJUTNYA</button>
            </Link>
        </section>
    </main>
);

export default Stimulation;