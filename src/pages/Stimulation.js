import { Link } from "react-router-dom";

import Navbar from '../components/Navbar';

const Stimulation = () => (
    <main className="bg-base-200 flex flex-col h-screen">
        <Navbar backLinkTo="/" />
        <div className="flex flex-col flex-grow justify-center items-center text-center px-8">
            <img src={require('../assets/images/logic.svg').default} alt="" className="w-48 mb-8" />
            <h1 className="font-bold">What would you do on a free afternoon in the middle of the week?</h1>
        </div>

        <div className="p-4">
            <Link to="/problem-identification">
                <button className="btn btn-primary w-full">SELANJUTNYA</button>
            </Link>
        </div>
    </main>
);

export default Stimulation;