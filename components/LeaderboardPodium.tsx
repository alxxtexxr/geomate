// Components
import Avatar from './Avatar';

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
    <section className="flex justify-center items-end bg-base-200 text-primary-content px-4 pt-8 rounded-b-xl shadow">
        {[2, 1, 3].map((rank) => {
            const user = users[rank - 1];

            return user && (
                <div className="w-1/3 text-center" key={rank}>
                    <Avatar
                        src={user.image || undefined}
                        alt={user.name ? `${user.name}'s Avatar` : undefined}
                    />
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