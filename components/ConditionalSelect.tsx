import { useEffect, useState, useCallback } from 'react';

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
    const [value, setValue] = useState<string>('');

    // Functions
    const getIsCorrect = useCallback(
        (_value: string) => isNaN(+correctOptionValue) ? _value === correctOptionValue : +_value === +correctOptionValue,
        [correctOptionValue]
    );
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (onChange) { onChange(e); }
        setValue(e.target.value);
    };

    useEffect(() => setIsCorrect(getIsCorrect(value)), [getIsCorrect, value]);

    return (
        <div className={className}>
            <select
                className={
                    'select select-bordered w-full' +
                    (isCorrect ? ' select-primary' : ' select-error')
                }
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