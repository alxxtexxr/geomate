type Props = {
    children: JSX.Element | JSX.Element[] | string,
    color: string,
};

const Note = ({ children, color }: Props) => (
    <div className={`bg-${color} bg-opacity-10 text-${color} text-xs py-4 px-4 border-l-2 border-${color} rounded-r-lg`}>
        {children}
    </div>
);

export default Note;