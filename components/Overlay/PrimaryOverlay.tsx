type Props = {
    children: JSX.Element | JSX.Element[];
};

const PrimaryOverlay = ({ children }: Props) => (
    <div className="fixed z-20 inset-0 flex justify-center items-center w-screen h-screen bg-base-200 bg-opacity-95 text-white text-center">
        {children}
    </div>
);

export default PrimaryOverlay;