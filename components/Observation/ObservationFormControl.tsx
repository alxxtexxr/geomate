import { InputHTMLAttributes } from 'react';

// Component
import Input from './ObservationInput';

// Types
type Props = {
    title?: string,
    symbol?: string | null,
    suffix?: string | null,
    isCorrect?: boolean | null,
    canMeasure?: boolean,
};

const ObservationFormControl = ({
    title,
    symbol = null,
    suffix = null,
    isCorrect = null,
    canMeasure = false,
    ...rest
}: Props & InputHTMLAttributes<HTMLInputElement>) => (
    <div className="grid grid-cols-3">
        <span className="label-text flex items-center text-sm text-gray-800 pr-2">
            {symbol && (
                <div className="badge badge-primary badge-outline text-xs h-7 w-7 mr-2">
                    {symbol}
                </div>
            )}
            {title}
        </span>
        <div className="col-span-2">
            <Input
                suffix={suffix}
                isCorrect={isCorrect}
                canMeasure={canMeasure}
                {...rest}
            />
        </div>
    </div>
);

export default ObservationFormControl;