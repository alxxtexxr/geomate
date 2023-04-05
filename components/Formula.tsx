import katex from 'katex';

// Type
import type { HTMLAttributes } from 'react';

type Props = {
    formula: string,
    type?: 'DEFAULT' | 'primary',
};

const TYPE_CX_LIST = {
    'DEFAULT': 'bg-white text-gray-800 border-gray-300',
    'primary': 'bg-primary bg-opacity-5 text-primary border-primary',
};

const Formula = ({ formula, type = 'DEFAULT', className: cx, ...rest }: Props & HTMLAttributes<HTMLElement>) => {
    const typeCx = TYPE_CX_LIST[type];

    return (
        <div
            className={`inline-flex text-lg mx-0.5 py-4 px-6 border rounded-full ${typeCx}`}
            dangerouslySetInnerHTML={{
                __html: katex.renderToString(formula)
            }}
        />
    );
};

export default Formula;