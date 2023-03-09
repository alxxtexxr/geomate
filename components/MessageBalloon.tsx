type Props = {
    children: string,
};

const MessageBalloon = ({ children }: Props) => (
    <div className="message-balloon message-balloon-base-100">
        {children}
    </div>
);

export default MessageBalloon;