import Image from 'next/image';

// Types
import type { HTMLAttributes } from 'react';

type Props = {
    src?: string | undefined,
    alt?: string | undefined,
    size?: 'sm' | 'md' | 'lg' | 'xl',
};

const sizeCx: {[key: string]: string} = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-40 w-40',
};

const Avatar = ({ src, alt, size = 'md', className: cx, ...rest }: Props & HTMLAttributes<HTMLElement>) => (
    <div className="avatar" {...rest}>
        <div
            className={`relative rounded-full border-3 border-white shadow-sm shadow-blue-800/20 ${size ? sizeCx[size] : ''} ${cx}`}
            style={{ backgroundColor: '#C4C5C9' }}
        >
            <Image
                src={src || '/images/default-user-image.jpeg'}
                alt={alt || 'Avatar'}
                layout="fill"
                priority
            />
        </div>
    </div>
);

export default Avatar;