// Types
import type { HTMLAttributes } from 'react';

type Props = {
    children: JSX.Element[] | JSX.Element | string,
    color: string,
    position: 'l' | 'b' | 'bl',
    size?: 'sm' | 'md' | 'lg',
};

const MessageBalloon = ({ children, color, position, size = 'md', className: cx, ...rest }: Props & HTMLAttributes<HTMLElement>) => {
    const colorCx = color ? `message-balloon-${color}` : '';
    const positionCx = position ? `message-balloon-${position}` : '';
    const sizeCx = color ? `message-balloon-${size}` : '';

    return (
        <div
            className={`message-balloon ${colorCx} ${positionCx} ${sizeCx} ${cx}`}
            {...rest}
        >
            {children}
        </div>
    );
};

export default MessageBalloon;