type Props = {
    children: JSX.Element,
};

const Wrapper = ({ children }: Props) => (
    <div className="flex justify-center">
        <div className="relative w-96 min-h-screen">
            {children}
        </div>
    </div>
);

export default Wrapper;