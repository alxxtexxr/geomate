import { signIn } from 'next-auth/react';
import classNames from 'classnames';

// Components
import Icon from './SignInButtonIcon';

// Types
import type { ClientSafeProvider } from 'next-auth/react';

type Props = {
    provider: ClientSafeProvider;
};

const SignInButton = ({ provider }: Props) => {
    const addCns: { [key: string]: string } = {
        google: 'bg-google hover:bg-google-focus border-google hover:border-google-focus',
        facebook: 'bg-facebook hover:bg-facebook-focus border-facebook hover:border-facebook-focus',
    };

    return (
        <button className={classNames('btn w-full text-white', addCns[provider.name.toLowerCase()])}
            onClick={() => signIn(provider.id)}
        >
            <Icon providerName={provider.name} className="text-lg mr-2 -mt-1" />
            Masuk dengan {provider.name}
        </button>
    );
};

export default SignInButton;