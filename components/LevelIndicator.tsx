import Image from 'next/image';

// Utils
import { getLevel, getXpLimit, getXpPct } from '../Utils';

// Type
type Props = {
    xp: number,
};

const LevelIndicator = ({xp}: Props) => (
    <div className="flex items-center bg-white p-6 rounded-2xl shadow-sm shadow-blue-800/20">
        <div className="relative w-20 h-20 mr-4">
            <Image
                src="/images/level-medal.svg"
                alt={`Level ${getLevel(xp)}`}
                layout="fill"
                objectFit="contain"
            />
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-yellow-500 text-2xl font-bold">
                {getLevel(xp)}
            </div>
        </div>
        <div className="flex-grow -mb-1">
            <div className="text-yellow-500 text-xl font-semibold">Level {getLevel(xp)}</div>
            <div className="text-sm text-gray-500">{xp}/{getXpLimit(getLevel(xp))}</div>
            <div className="-mt-1">
                <progress className="progress progress-warning bg-gray-200" value={getXpPct(xp)} max="100" />
            </div>
        </div>
    </div>
);

export default LevelIndicator;