const Swap = ({ children, isActive = false, onClick }) => isActive ? (
    <button className="hover:bg-primary btn btn-primary btn-circle" onClick={onClick}>
        {children}
    </button>
) : (
    <button className="hover:bg-transparent text-primary hover:text-primary border-primary hover:border-primary btn btn-outline btn-circle border" onClick={onClick}>
        {children}
    </button>
);
export default Swap;