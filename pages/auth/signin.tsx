import { getProviders } from 'next-auth/react';
import Image from 'next/image';

// Components
import SignInButton from '../../components/SignIn/SignInButton';

// Types
import type { GetServerSideProps } from 'next';
import type { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import type { BuiltInProviderType } from 'next-auth/providers';
import type ComponentWithAuth from '../../types/ComponentWithAuth';

type Props = {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
};

const SignIn: ComponentWithAuth<Props> = ({ providers }) => {
    return (
        <main className="bg-base-100 min-h-screen">
            <header className="flex justify-center items-center bg-base-200 text-white py-8 mb-8 rounded-b-xl">
                <div className="relative h-20 w-20 mr-2">
                    <Image src="/images/logo.png"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <h1 className="text-4xl">
                    GeoMate
                </h1>
            </header>
            <section className="px-4">
                <div className="mb-8">
                    <h2 className="font-semibold text-3xl text-black text-opacity-90">Masuk</h2>
                    <p className="text-black text-opacity-60">Selamat datang, ayo mulai belajar.</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {providers && Object.values(providers).map((provider) => (
                        <SignInButton provider={provider} key={provider.id} />
                    ))}
                </div>
            </section>
        </main>
    )
};

SignIn.auth = false;

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();

    return { props: { providers } };
};

export default SignIn;