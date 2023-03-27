type Props = {
    children: JSX.Element | JSX.Element[];
};

const PrimaryOverlay = ({ children }: Props) => (
    <div className="absolute z-20 inset-0 flex justify-center items-center w-inherit h-screen bg-base-200 bg-opacity-95 text-white text-center">
        {children}
    </div>
);

export default PrimaryOverlay;