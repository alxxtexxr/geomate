type Props = {
    children: JSX.Element | JSX.Element[],
    className?: string,
};

const BottomSheet = ({ children, className }: Props) => (
    <div className={
        'relative z-90 flex flex-col flex-grow bg-white text-gray-600 text-sm min-h-screen rounded-tl-2xl rounded-tr-2xl shadow' +
        (className ? ' ' + className : '')
    }>
        {children}
    </div>
);

export default BottomSheet;