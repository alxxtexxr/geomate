type Props = {
    children: JSX.Element | JSX.Element[] | string,
    color: string,
};

const Note = ({ children, color }: Props) => (
    <div className={`bg-yellow-500 bg-opacity-10 text-yellow-500 text-xs py-4 px-4 border-l-2 border-yellow-500 rounded-r-lg`}>
        {children}
    </div>
);

export default Note;