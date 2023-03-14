type Props = {
    children: JSX.Element | JSX.Element[];
};

const BlackOverlay = ({ children }: Props) => (
    <div className="absolute z-20 inset-0 flex justify-center items-center w-inherit h-screen bg-black bg-opacity-95 text-gray-300 text-sm">
        {children}
    </div>
);

export default BlackOverlay;