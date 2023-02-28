type Props = {
    children: JSX.Element,
};

const Wrapper = ({ children }: Props) => (
    <div className="bg-gray-100 flex justify-center">
        <div className="relative w-96 min-h-screen overflow-hidden">
            {children}
        </div>
    </div>
);

export default Wrapper;