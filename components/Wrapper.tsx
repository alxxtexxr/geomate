type Props = {
    children: JSX.Element,
};

const Wrapper = ({ children }: Props) => (
    <div className="bg-white flex justify-center">
        <div className="relative w-96 min-h-screen overflow-hidden">
            {children}
        </div>
    </div>
);

export default Wrapper;