import { useState } from 'react';
import classNames from 'classnames';

// Types
import type { SelectHTMLAttributes, ChangeEvent } from 'react';

type Props = {
    options: {
        title: any,
        value?: any,
        disabled?: boolean,
        selected?: boolean,
    }[],
    correctOptionValue: string,
    incorrectMessage: string,
}

const ConditionalSelect = ({ options, correctOptionValue, className, incorrectMessage, onChange, ...props }: Props & SelectHTMLAttributes<HTMLSelectElement>) => {
    // States
    const [isCorrect, setIsCorrect] = useState<boolean>(false);

    // Functions
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (onChange) { onChange(e); }

        const _isCorrect = isNaN(+correctOptionValue) ? e.target.value === correctOptionValue : +e.target.value === +correctOptionValue;

        setIsCorrect(_isCorrect);
    };

    return (
        <div className={className}>
            <select
                className={classNames('select select-bordered w-full font-normal', {
                    'select-primary': isCorrect,
                    'select-error': !isCorrect,
                })}
                onChange={handleChange}
                {...props}
            >
                {options.map((option) => (
                    <option {...option} key={option.title}>{option.title}</option>
                ))}
            </select>
            {!isCorrect && (
                <label className="label">
                    <span className="label-text-alt text-error leading-none">
                        {incorrectMessage}
                    </span>
                </label>
            )}
        </div>
    );
};

export default ConditionalSelect;