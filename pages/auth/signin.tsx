import { getProviders, signIn } from 'next-auth/react';

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
        <main className="bg-base-200 min-h-screen">
            {/* <header className="flex flex-col justify-center text-center bg-primary-content py-8 rounded-b-xl">
                <h1 className="font-semibold text-3xl">
                    Geomate
                </h1>
            </header> */}
            <section className="p-4">
                <div className="mt-4 mb-8">
                    <h2 className="font-semibold text-3xl">Masuk</h2>
                    <p className="text-sm">Selamat datang, ayo mulai belajar.</p>
                </div>
                {providers && Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <button className="btn btn-primary w-full mb-4" onClick={() => signIn(provider.id)}>
                            Sign in with {provider.name}
                        </button>
                    </div>
                ))}
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