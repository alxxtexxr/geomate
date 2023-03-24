import MessageBalloon from '..//MessageBalloon';
import Image from 'next/image';

type Props = {
    children: string,
};

const ObservationMessage = ({ children }: Props) => (

    <>
        {/* <div className="avatar">
            <div className="w-20 rounded-full">
                <img src="https://www.meme-arsenal.com/memes/ad49f5fb6248c93511637fd13463918f.jpg" />
            </div>
        </div> */}
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
            className="ml-4"
        >
            {children}
        </MessageBalloon>
    </>
);

export default ObservationMessage;