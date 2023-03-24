import type { HTMLAttributes } from 'react';

type Props = {
    children: JSX.Element | JSX.Element[] | string,
    className?: string,
};

const BottomSheet = ({ children, className, ...rest }: Props & HTMLAttributes<HTMLElement>) => (
    <div
        className={
            'relative z-90 flex flex-col flex-grow bg-white text-gray-600' +
            (className ? ' ' + className : '')
        }
        {...rest}
    >
        {children}
    </div>
);

export default BottomSheet;