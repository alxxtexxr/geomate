import Image from 'next/image';

// Utils
import { getInitials } from '../Utils';

// Types
import type { User } from '@prisma/client';

type Props = {
    users: User[],
};

const clipPaths = [
    { clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' },
    { clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' },
    { clipPath: 'polygon(0% 0%, 80% 0%, 100% 100%, 0% 100%)' },
];

const LeaderboardPodium = ({ users }: Props) => (
    <section className="flex items-end bg-base-200 text-primary-content px-4 pt-8 rounded-b-xl">
        {[2, 1, 3].map((rank) => {
            const user = users[rank - 1];

            return (
                <div className="w-1/3 text-center" key={rank}>
                    <div className="avatar">
                        <div
                            className="relative h-16 w-16 rounded-full ring ring-white shadow"
                            style={{ backgroundColor: '#C4C5C9' }}
                        >
                            <Image
                                src={user.image || '/images/default-user-image.jpeg'}
                                alt={user.name || ''}
                                layout="fill"
                                priority
                            />
                        </div>
                    </div>
                    <div className="my-2">
                        <h1 className="font-medium leading-none">
                            {user.name && getInitials(user.name)}
                        </h1>
                        <span className="text-sm">
                            {user.xp} XP
                        </span>
                    </div>
                    <div className="bg-secondary h-5" style={clipPaths[rank - 1]}></div>
                    <div
                        className="flex justify-center items-center bg-gradient-to-t from-secondary to-primary text-6xl font-bold"
                        style={{ height: (200 - (40 * (rank - 1))) }}
                    >
                        {rank}
                    </div>
                </div>
            )
        })}
    </section>
);

export default LeaderboardPodium;