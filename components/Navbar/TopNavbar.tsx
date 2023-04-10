type Props = {
    title?: string,
    leftButton?: JSX.Element,
    rightButton?: JSX.Element,
    light?: boolean,
};

const TopNavbar = ({ title, leftButton, rightButton, light = false }: Props) => {
    const lightCx = light ? 'text-white' : 'text-gray-800';

    return (
        <nav className="flex justify-between items-center p-2">
            {leftButton ? leftButton : (<div className="h-12 aspect-square" />)}
            {title && (
                <h1 className={`font-semibold ${lightCx}`}>{title}</h1>
            )}
            {rightButton ? rightButton : (<div className="h-12 aspect-square" />)}
        </nav>
    );
};

export default TopNavbar;