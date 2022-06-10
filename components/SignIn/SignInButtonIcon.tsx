import { FaGoogle, FaFacebook, FaSmile } from 'react-icons/fa';

// Types
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = {
    providerName: string,
} & DetailedHTMLProps<HTMLAttributes<HTMLOrSVGElement>, HTMLDivElement>;

const SignInButtonIcon = ({ providerName, ...props }: Props) => {
    if (providerName === 'Google') { return (<FaGoogle {...props} />); }
    if (providerName === 'Facebook') { return (<FaFacebook {...props} />); }
    return (<FaSmile {...props} />)
};

export default SignInButtonIcon;