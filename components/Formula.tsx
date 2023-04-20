import katex from 'katex';

// Type
import type { HTMLAttributes } from 'react';

type Props = {
    formula: string | string[],
    type?: 'DEFAULT' | 'primary',
};

const TYPE_CX_MAP = {
    'DEFAULT': 'bg-white text-gray-800 border-gray-300',
    'primary': 'bg-primary bg-opacity-5 text-primary border-primary',
};

const Formula = ({ formula, type = 'DEFAULT', className: cx, ...rest }: Props & HTMLAttributes<HTMLElement>) => {
    const typeCx = TYPE_CX_MAP[type];

    if (typeof formula === 'string') {
        return (
            <div
                className={`inline-flex mx-0.5 py-4 px-6 border rounded-full ${cx} ${typeCx}`}
                dangerouslySetInnerHTML={{
                    __html: katex.renderToString(formula)
                }}
                {...rest}
            />
        );
    } else if (Array.isArray(formula)) {
        return (
            <div className={`grid grid-cols-1 px-4 items-center border rounded-2xl ${cx} ${typeCx}`} {...rest}>
                {formula.map((formulaI, i) => (
                    <div
                        key={i}
                        className={'py-4 ' + (i + 1 < formula.length ? 'border-b border-gray-300' : '')}
                        dangerouslySetInnerHTML={{
                            __html: katex.renderToString(formulaI)
                        }}
                    />
                ))}
            </div>
        );
    } else {
        return null;
    }
};

export default Formula;