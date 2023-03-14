import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { MdEdit } from 'react-icons/md';

// Components
import Navbar from '../components/Navbar';
import AvatarUploader from '../components/AvatarUploader';
import NameEditForm from '../components/ProfileNameEditForm';
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

    const [isOpen, setIsOpen] = useState(false);

    return (
        <main className="bg-base-100 w-inherit min-h-screen pb-20">
            {/* Header */}
            <header className="flex flex-col justify-center items-center text-center bg-base-200 text-primary-content pt-8 pb-14">
                <AvatarUploader />
                <div className="mt-4">
                    <a className="link link-hover" onClick={() => setIsOpen(!isOpen)}>
                        <h1 className="inline-flex items-center font-medium">
                            {session?.user?.name || 'Kamu'}
                            <MdEdit className="text-lg ml-1" />
                        </h1>
                    </a>
                    <p className="text-sm">
                        Pencapaian kamu: <span className="font-semibold">0</span> dari <span className="font-semibold">{achievements.length}</span>
                    </p>
                </div>
            </header>

            {/* Achievements */}
            <section className="grid grid-cols-3 gap-4 -mt-12 p-4">
                {achievements.map((achievement) => (
                    <Achievement
                        title={achievement.title}
                        isLocked={!!!achievement.userAchievements.length}
                        key={achievement.id}
                    />
                ))}
            </section>

            <NameEditForm isOpen={isOpen} setIsOpen={setIsOpen} />


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