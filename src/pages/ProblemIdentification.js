import { Link } from "react-router-dom";
import { IoCamera } from 'react-icons/io5';

import Navbar from '../components/Navbar';

const ProblemIdentification = () => (
    <main className="bg-base-200 flex flex-col h-screen">
        <Navbar backLinkTo="/stimulation" />
        <section className="flex flex-col flex-grow justify-center items-center text-center px-8">
            <img src={require('../assets/images/logic.svg').default} alt="" className="w-48 mb-8" />
            <h1 className="font-bold">What is something you can never seem to finish?</h1>
        </section>

        <section className="p-4">
            <Link to="/classification">
                <button className="btn btn-primary w-full gap-2">
                    <IoCamera className="text-2xl" />
                    Mulai Observasi
                </button>
            </Link>
        </section>
    </main>
);

export default ProblemIdentification;