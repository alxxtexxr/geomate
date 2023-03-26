import MessageBalloon from '..//MessageBalloon';
import Image from 'next/image';

type Props = {
    children: string,
};

const ObservationMessage = ({ children }: Props) => (
    <>
        <div className="relative w-40 drop-shadow-md">
            <Image
                src="/images/geo-head.svg"
                alt="Geo"
                layout="fill"
                objectFit="contain"
            />
        </div>
        <MessageBalloon
            color="base-100"
            position="l"
            className="text-gray-600 text-sm ml-4"
        >
            {children}
        </MessageBalloon>
    </>
);

export default ObservationMessage;