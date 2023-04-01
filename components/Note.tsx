type Props = {
    children: JSX.Element | JSX.Element[] | string,
};

const Note = ({ children }: Props) => (
    <div className="text-gray-600 text-xs px-2 border-l-2 border-primary">
        {children}
    </div>
);

export default Note;