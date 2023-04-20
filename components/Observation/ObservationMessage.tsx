import MessageBalloon from '..//MessageBalloon';
import Image from 'next/image';
import Typewriter from 'typewriter-effect';

type Props = {
    message: string | string[],
    button?: JSX.Element,
};

const TYPEWRITER_DELAY = 25;

const ObservationMessage = ({ message, button }: Props) => (
    <div className="grid grid-cols-4 gap-4 w-full">
        <div className="col-span-1 flex justify-center items-center">
            <div className="relative w-full aspect-square drop-shadow-md-blue-800">
                <Image
                    src="/images/mascot-head.svg"
                    alt={process.env.NEXT_PUBLIC_APP_MASCOT_NAME}
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
                <div className="font-semibold mb-1">{process.env.NEXT_PUBLIC_APP_MASCOT_NAME}</div>
                <Typewriter
                    options={{
                        delay: TYPEWRITER_DELAY,
                        cursor: '',
                    }}
                    onInit={(typewriter) => {
                        if (typeof message === 'string') {
                            typewriter.typeString(message).start()
                        } else if (Array.isArray(message)) {
                            let _typewriter = typewriter.typeString(message[0]);

                            message.slice(1).map((message) => {
                                _typewriter = _typewriter.pauseFor(1000).deleteAll(TYPEWRITER_DELAY).typeString(message)
                            })

                            _typewriter.start()
                        }
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