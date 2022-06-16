import Image from 'next/image';

// Types
import { Session } from 'next-auth';

type Props = {
    user: Session['user'] | undefined,
    size?: 'sm' | 'md' | 'lg',
};

const sizeCx: {[key: string]: string} = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
};

const Avatar = ({ user, size = 'md' }: Props) => (
    <div className="avatar">
        <div
            className={
                'relative rounded-full ring ring-white shadow' + 
                (size ? ` ${sizeCx[size]}` : '')
            }
            style={{ backgroundColor: '#C4C5C9' }}
        >
            <Image
                src={user?.image || '/images/default-user-image.jpeg'}
                alt={user?.name ? `${user.name}'s Avatar` : 'Avatar'}
                layout="fill"
                priority
            />
        </div>
    </div>
);

export default Avatar;