import MessageBalloon from '..//MessageBalloon';
import Image from 'next/image';
import Typewriter from 'typewriter-effect';

type Props = {
    children: string,
};

const TYPEWRITER_DELAY = 25;

const ObservationMessage = ({ children }: Props) => (
    <div className="grid grid-cols-4 gap-4 w-full">
        <div className="relative col-span-1 w-full aspect-square drop-shadow-md-blue-800">
            <Image
                src="/images/geo-head.svg"
                alt="Geo"
                layout="fill"
                objectFit="contain"
            />
        </div>
        <div className="col-span-3 flex justify-center items-center">
            <MessageBalloon
                color="base-100"
                position="l"
                className="flex-grow text-sm"
            >
                <Typewriter
                    options={{
                        delay: TYPEWRITER_DELAY,
                        cursor: '',
                    }}
                    onInit={(typewriter) => {
                        typewriter.typeString(children).start();
                    }}
                />
            </MessageBalloon>
        </div>
    </div>
);

export default ObservationMessage;