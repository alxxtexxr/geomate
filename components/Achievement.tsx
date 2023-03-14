import Image from 'next/image';
import AchievementIcon from '../public/images/achievement.svg';

// Types
type Props = {
    title: string,
    isLocked?: boolean,
}

const Achievement = ({ title, isLocked = true, }: Props) => (
    <div
        className={
            'relative flex flex-col justify-items items-center text-center px-2 py-6 rounded-xl overflow-hidden' +
            (isLocked ? ' bg-white text-gray-800 text-opacity-40' : ' bg-base-200 text-white')
        }
    >
        <AchievementIcon />
        <h2 className="text-sm font-medium mt-2 -mb-1">
            {title}
        </h2>
        <div className="absolute -right-8 -bottom-4 bg-white bg-opacity-20 w-24 h-24 rounded-full" />
    </div>
);

export default Achievement;