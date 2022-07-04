import { useEffect, useState } from 'react';

// Types
import type { InputHTMLAttributes, ChangeEvent } from 'react';

type Props = {
    correctValue: string,
    incorrectMessage: string,
    suffix?: any,
}

const ConditionalInput = ({ correctValue, className, incorrectMessage, suffix, onChange, value, ...props }: Props & InputHTMLAttributes<HTMLInputElement>) => {
    // States
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    // const [value, setValue] = useState<string>('');

    // Functions
    const getIsCorrect = (_value: string) => isNaN(+correctValue) ? _value === correctValue : +_value === +correctValue
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) { onChange(e); }
        // setValue(e.target.value);
    };

    useEffect(() => {
        setIsCorrect(getIsCorrect('' + value));
    }, [correctValue, value]);

    return (
        <div className={className}>
            {suffix ? (
                <label className="input-group input-error">
                    <input
                        className={
                            'input input-bordered w-full font-normal' +
                            (isCorrect ? ' input-primary' : ' input-error')
                        }
                        onChange={handleChange}
                        value={value}
                        {...props}
                    />
                    <span className="text-sm font-medium">
                        {suffix}
                    </span>
                </label>
            ) : (
                <input
                    className={
                        'input input-bordered w-full font-normal' +
                        (isCorrect ? ' input-primary' : ' input-error')
                    }
                    onChange={handleChange}
                    value={value}
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