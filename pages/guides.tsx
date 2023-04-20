import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MdArrowBack } from 'react-icons/md';

// Components
import Navbar from '../components/Navbar';

// Constants
import { GUIDES, NAVBAR_BOTTOM_MENU } from '../Constants';

// Types
import type ComponentWithAuth from '../types/ComponentWithAuth';

const Guides: ComponentWithAuth = () => {
    const router = useRouter();

    return (
        <main className="bg-base-100 w-inherit min-h-screen">
            <Head>
                <title>Petunjuk | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <Navbar.Top
                title="Petunjuk"
                leftButton={(
                    <button type="button" className="btn btn-circle btn-ghost" onClick={router.back}>
                        <MdArrowBack className="text-2xl" />
                    </button>
                )}
            />

            <section className="grid grid-cols-1 gap-4 p-4">
                {GUIDES.map((guide) => (
                    <div className="collapse collapse-arrow bg-white rounded-xl shadow-sm shadow-blue-800/20" key={guide.title}>
                        <input type="checkbox" />
                        <div className="collapse-title flex justify-start items-center">
                            <div className="relative h-10 w-10 mr-4">
                                <Image src="/images/guide.png" alt="KI/KD" layout="fill" />
                            </div>
                            <h2 className="font-medium text-gray-800">
                                {guide.title}
                            </h2>
                        </div>
                        <div className="collapse-content">
                            <table className="text-gray-600 text-sm mx-2">
                                <tbody>
                                    {guide.contents.map((content) => (
                                        <tr className="align-top" key={content.no}>
                                            <td className="pr-4">
                                                {content.no}
                                            </td>
                                            <td>
                                                {content.content}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </section>

            <Navbar.Bottom menu={NAVBAR_BOTTOM_MENU} />
        </main>
    );
};

Guides.auth = true;

export default Guides;

function useNavigate(arg0: number): void {
    throw new Error('Function not implemented.');
}
