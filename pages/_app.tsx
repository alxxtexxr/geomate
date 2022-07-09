import { useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

// Components
import LoaderScreen from '../components/LoaderScreen';
import BetterExperienceScreen from '../components/BetterExperienceScreen';

// Types
import type { AppProps } from 'next/app';
import type ComponentWithAuth from '../types/ComponentWithAuth';


const MyApp = ({ Component, pageProps }: AppProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const isDesktop = useMediaQuery({ query: `(min-width: 760px)` });

    useEffect(() => setIsMounted(true), []);

    return (
        <SessionProvider session={pageProps.session}>
            {(Component as ComponentWithAuth).auth ? (
                <Auth>
                    <Component {...pageProps} />
                </Auth>
            ) : (
                <Component {...pageProps} />
            )}

            {(isMounted && isDesktop && isOpen) && (<BetterExperienceScreen onClose={() => setIsOpen(false)} />)}

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </SessionProvider>
    );
};

type AuthProps = {
    children: JSX.Element,
};

const Auth = ({ children }: AuthProps) => {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { status } = useSession({ required: true });

    return (status === 'loading') ? (<LoaderScreen />) : children;
};

export default MyApp;