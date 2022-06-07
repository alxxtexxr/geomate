import { useEffect, useState } from 'react';
import classNames from 'classnames';

// Types
import type { InputHTMLAttributes, ChangeEvent } from 'react';

type Props = {
    correctValue: string,
    incorrectMessage: string,
    suffix?: any,
}

const ConditionalInput = ({ correctValue, className, incorrectMessage, suffix, onChange, ...props }: Props & InputHTMLAttributes<HTMLInputElement>) => {
    // States
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');

    // Functions
    const getIsCorrect = (_value: string) => isNaN(+correctValue) ? _value === correctValue : +_value === +correctValue
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) { onChange(e); }

        setValue(e.target.value);
        setIsCorrect(getIsCorrect(value));
    };

    useEffect(() => {
        setIsCorrect(getIsCorrect(value));
    }, [correctValue])

    return (
        <div className={className}>
            {suffix ? (
                <label className="input-group input-error">
                    <input
                        className={classNames('input input-bordered w-full font-normal', {
                            'input-primary': isCorrect,
                            'input-error': !isCorrect,
                        })}
                        onChange={handleChange}
                        {...props}
                    />
                    <span className="text-sm font-semibold">
                        {suffix}
                    </span>
                </label>
            ) : (
                <input
                    className={classNames('input input-bordered w-full font-normal', {
                        'input-primary': isCorrect,
                        'input-error': !isCorrect,
                    })}
                    onChange={handleChange}
                    {...props}
                />
            )}
            {!isCorrect && (
                <label className="label">
                    <span className="label-text-alt text-error leading-none">
                        {incorrectMessage}
                    </span>
                </label>
            )}
        </div >
    );
};

export default ConditionalInput;