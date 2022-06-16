import { useSession } from 'next-auth/react';

// Components
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import Achievement from '../components/Achievement';

// Constants
import { NAVBAR_BOTTOM_MENU } from '../Constants';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../types/ComponentWithAuth';
import type { Prisma } from '@prisma/client';

type Achievement = Prisma.AchievementGetPayload<{
    include: {
        userAchievements: {
            include: {
                user: true
            }
        },
    },
}>;

type Props = {
    achievements: Achievement[],
};

const Profile: ComponentWithAuth<Props> = ({ achievements }) => {
    const { data: session } = useSession();

    return (
        <main className="pb-20">
            {/* Header */}
            <header className="flex flex-col justify-center items-center text-center bg-base-200 text-primary-content pt-8 pb-14 rounded-b-xl">
                <Avatar
                    src={session?.user.image || undefined}
                    alt={session?.user.name ? `${session?.user.name}'s Avatar` : undefined}
                    size='lg'
                />
                <div className="mt-4">
                    <h1 className="font-medium">Halo, {session?.user?.name || 'Kamu'}</h1>
                    <p className="text-sm">Mau belajar apa hari ini?</p>
                </div>
            </header>

            {/* Achievements */}
            <section className="grid grid-cols-2 gap-4 p-4">
                {/* {console.log({achievements})} */}
                {achievements.map((achievement) => (
                    <Achievement
                        title={achievement.title}
                        isLocked={!!!achievement.userAchievements.length}
                        key={achievement.id}
                    />
                ))}
            </section>


            {/* Navbar Bottom */}
            <Navbar.Bottom menu={NAVBAR_BOTTOM_MENU} />
        </main>
    );
};

Profile.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const headers = context.req.headers;
    const id = context?.params?.id || null;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/achievements?orderBy[][userAchievements][_count]=desc`, {
        headers: { 'Cookie': headers.cookie as string },
    });
    const achievements = await res.json();

    return { props: { achievements } };
};

export default Profile;