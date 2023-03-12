import MessageBalloon from '..//MessageBalloon';

type Props = {
    children: string,
};

const ObservationMessage = ({ children }: Props) => (

    <>
        <div className="avatar">
            <div className="w-20 rounded-full">
                <img src="https://www.meme-arsenal.com/memes/ad49f5fb6248c93511637fd13463918f.jpg" />
            </div>
        </div>
        <MessageBalloon>
            {children}
        </MessageBalloon>
    </>
);

export default ObservationMessage;