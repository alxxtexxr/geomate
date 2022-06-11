import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';

// Components
import Loader from '../components/Loader';

// Types
import type { AppProps } from 'next/app';
import type ComponentWithAuth from '../types/ComponentWithAuth';

const MyApp = ({ Component, pageProps }: AppProps) => (
    <SessionProvider session={pageProps.session}>
        {(Component as ComponentWithAuth).auth ? (
            <Auth>
                <Component {...pageProps} />
            </Auth>
        ) : (
            <Component {...pageProps} />
        )}
    </SessionProvider>
);

type AuthProps = {
    children: JSX.Element,
};

const Auth = ({ children }: AuthProps) => {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { status } = useSession({ required: true });

    if (status === 'loading' && true) {
        return (<Loader />);
    }

    return children;
};

export default MyApp;