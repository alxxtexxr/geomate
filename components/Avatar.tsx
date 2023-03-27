import Image from 'next/image';

// Types
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

const Avatar = ({ src, alt, size = 'md' }: Props) => (
    <div className="avatar">
        <div
            className={
                'relative rounded-full ring ring-white shadow' + 
                (size ? ` ${sizeCx[size]}` : '')
            }
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