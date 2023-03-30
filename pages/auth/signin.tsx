import { getProviders } from 'next-auth/react';
import Head from 'next/head';

// Components
import Logo from '../../components/Logo';
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
            <Head>
                <title>Masuk | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <header className="flex justify-center bg-base-200 py-8 mb-8 rounded-b-2xl">
                <Logo />
            </header>
            
            <section className="px-4">
                <div className="mb-8">
                    <h2 className="font-medium text-3xl text-gray-800">Masuk</h2>
                    <p className="text-gray-800 text-sm">Selamat datang, ayo mulai belajar!</p>
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