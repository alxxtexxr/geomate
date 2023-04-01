import MessageBalloon from '..//MessageBalloon';
import Image from 'next/image';
import Typewriter from 'typewriter-effect';

type Props = {
    children: string,
    button?: JSX.Element,
};

const TYPEWRITER_DELAY = 25;

const ObservationMessage = ({ children, button }: Props) => (
    <div className="grid grid-cols-4 gap-4 w-full">
        <div className="col-span-1 flex justify-center items-center">
            <div className="relative w-full aspect-square drop-shadow-md-blue-800">
                <Image
                    src="/images/geo-head.svg"
                    alt="Geo"
                    layout="fill"
                    objectFit="contain"
                />
            </div>
        </div>
        <div className="col-span-3 flex justify-center items-center">
            <MessageBalloon
                color="white-outline"
                position="l"
                className="flex-grow text-sm"
            >
                <div className="font-semibold mb-2">Geo</div>
                <Typewriter
                    options={{
                        delay: TYPEWRITER_DELAY,
                        cursor: '',
                    }}
                    onInit={(typewriter) => {
                        typewriter.typeString(children).start();
                    }}
                />
                {button ? (
                    <div className="mt-3">
                        {button}
                    </div>
                ) : (<></>)}
            </MessageBalloon>
        </div>
    </div>
);

export default ObservationMessage;