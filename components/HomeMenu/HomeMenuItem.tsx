import Image from 'next/image';

// Types
import type HomeMenu from '../../types/HomeMenuItem';

type Props = HomeMenu & { onClick: () => void };

const HomeMenuItem = ({ code, name, isLocked, onClick }: Props) => {
    const isLockedCx = isLocked ? 'grayscale' : 'cursor-pointer';

    // I think it's better if there's alert if the menu item is locked
    return (
        <div
            className={`flex flex-col justify-center items-center bg-white py-8 rounded-2xl shadow-sm shadow-blue-800/20 ${isLockedCx}`}
            {...(isLocked ? {} : { onClick: onClick })}
        >
            <div className="relative h-20 w-20 mb-4">
                <Image src={`/images/${code}.png`} alt={name} layout="fill" />
            </div>
            <h2 className="font-medium text-gray-800 -mb-1">
                {name}
            </h2>
        </div>
    )
};

export default HomeMenuItem;