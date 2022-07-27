type Props = {
    children: JSX.Element | JSX.Element[],
    className?: string,
};

const BottomSheet = ({ children, className }: Props) => (
    <div className={
        'relative z-90 flex flex-col flex-grow bg-white text-gray-500 text-sm min-h-screen px-4 rounded-tl-xl rounded-tr-xl shadow' +
        (className ? ' ' + className : '')
    }>
        {children}
    </div>
);

export default BottomSheet;