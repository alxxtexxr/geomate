type Props = {
    children: JSX.Element | string,
    isActive?: boolean,
    onClick: () => void,
};

const Swap = ({ children, isActive = false, onClick }: Props) => isActive ? (
    <button className="hover:bg-primary btn btn-primary btn-circle" onClick={onClick}>
        {children}
    </button>
) : (
    // <button className="hover:bg-transparent text-primary hover:text-primary border-primary hover:border-primary btn btn-outline btn-circle border" onClick={onClick}>
    <button className="bg-base-100 hover:bg-base-100 text-primary border-white btn btn-circle border" onClick={onClick}>
        {children}
    </button>
);
export default Swap;