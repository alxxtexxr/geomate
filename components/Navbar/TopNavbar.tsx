type Props = {
    title?: string,
    leftButton?: JSX.Element,
};

const TopNavbar = ({ title, leftButton }: Props) => (
    <nav className="flex justify-between items-center p-2">
        {leftButton ? leftButton : (<div className="h-12 aspect-square" />)}
        {title && (
            <h1 className="font-semibold text-gray-800">{title}</h1>
        )}
        <div className="h-12 w-12" />
    </nav>
);

export default TopNavbar;