// Constant
const TYPE_CX_LIST = {
    'DEFAULT': 'bg-white text-gray-800 border-gray-200',
    'primary': 'bg-primary bg-opacity-5 text-primary border-primary',
};

// Type

type Props = {
    children: JSX.Element | JSX.Element[] | string | string[],
    type?: 'DEFAULT' | 'primary',
};

const Formula = ({ children, type = 'DEFAULT' }: Props) => {
    const typeCx = TYPE_CX_LIST[type];

    return (
        <div className={`inline-flex font-mono py-4 px-8 border rounded-full ${typeCx}`}>
            {children}
        </div>
    );
};

export default Formula;