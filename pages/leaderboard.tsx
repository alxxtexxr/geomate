// Components
import Navbar from '../components/Navbar';
import Podium from '../components/LeaderboardPodium';
import Avatar from '../components/Avatar';

// Constants
import { NAVBAR_BOTTOM_MENU } from '../Constants';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../types/ComponentWithAuth';
import type { User } from '@prisma/client';

type Props = {
    users: User[],
};

const Leaderboard: ComponentWithAuth<Props> = ({ users }) => (
    <main>
        <Podium users={users.slice(0, 3)} />

        <section className="p-4">
            <ol className="flex flex-col">
                {users.slice(3).map((user, i) => (
                    <li
                        className={
                            'flex items-center py-4 border-gray-300' +
                            (i + 1 < users.slice(3).length ? ' border-b' : '')
                        }
                        key={user.name}
                    >
                        <Avatar user={user} size="sm" />
                        <div className="ml-4 mr-auto">
                            <h2 className="text-gray-800 font-medium leading-none">
                                {user.name}
                            </h2>
                            <span className="text-gray-500 text-sm">
                                {user.xp} XP
                            </span>
                        </div>
                        <div>
                            <span className="badge bg-gray-800 text-white h-8 w-8 -my-4 mr-4 border-none">
                                {i + 4}
                            </span>
                        </div>
                    </li>
                ))}
            </ol>
        </section>

        <Navbar.Bottom menu={NAVBAR_BOTTOM_MENU} />
    </main >
);

Leaderboard.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers;
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users?orderBy[][xp]=desc`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const users = await res.json();

    return { props: { users } };
};

export default Leaderboard;