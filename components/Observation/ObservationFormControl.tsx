import { InputHTMLAttributes } from 'react';

// Component
import Label from './ObservationLabel';
import Input from './ObservationInput';

// Type
type Props = {
    label?: string,
    symbol?: string | null,
    suffix?: string | null,
    isCorrect?: boolean | null,
    canMeasure?: boolean,
    onMeasure?: () => void,
};

const ObservationFormControl = ({
    label,
    symbol = null,
    suffix = null,
    isCorrect = null,
    canMeasure = false,
    onMeasure,
    ...rest
}: Props & InputHTMLAttributes<HTMLInputElement>) => (
    <div className="grid grid-cols-3">
        <Label symbol={symbol}>
            {label}
        </Label>
        <div className="col-span-2">
            <Input
                suffix={suffix}
                isCorrect={isCorrect}
                canMeasure={canMeasure}
                onMeasure={onMeasure}
                {...rest}
            />
        </div>
    </div>
);

export default ObservationFormControl;