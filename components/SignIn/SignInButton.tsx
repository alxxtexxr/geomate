import { signIn } from 'next-auth/react';

// Components
import Icon from './SignInButtonIcon';

// Types
import type { ClientSafeProvider } from 'next-auth/react';

type Props = {
    provider: ClientSafeProvider;
};

const SignInButton = ({ provider }: Props) => {
    const providerNameCx: { [key: string]: string } = {
        google: 'bg-google hover:bg-google-focus border-google hover:border-google-focus',
        facebook: 'bg-facebook hover:bg-facebook-focus border-facebook hover:border-facebook-focus',
    };
    const cx =
        'btn w-full text-white' +
        (provider.name ? ` ${providerNameCx[provider.name]}` : '');

    return (
        <button className={cx} onClick={() => signIn(provider.id)}>
            <Icon providerName={provider.name} className="text-lg mr-2 -mt-1" />
            Masuk dengan {provider.name}
        </button>
    );
};

export default SignInButton;