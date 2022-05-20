import { IoCamera } from 'react-icons/io5';

const Classification = () => (
    <main className="relative bg-neutral h-screen">
        <section className="fixed bottom-0 w-screen text-center p-8">
            <button className="btn btn-lg btn-primary btn-circle">
                <IoCamera className="text-2xl" />
            </button>
        </section>
    </main>
);

export default Classification;