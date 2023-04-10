import { InputHTMLAttributes } from 'react';
import { MdOutlineSwitchCamera } from 'react-icons/md';

// Types
type Props = {
    isCorrect?: boolean | null,
    suffix?: string | null,
    canMeasure?: boolean,
    onMeasure?: () => void,
};

const ObservationInput = ({
    isCorrect,
    suffix = null,
    canMeasure = false,
    onMeasure,
    ...rest
}: Props & InputHTMLAttributes<HTMLInputElement>) => {
    const inputCx = isCorrect !== null ? (isCorrect ? 'input-primary' : 'input-error') : '';
    const bgColorCx = isCorrect !== null ? (isCorrect ? 'bg-primary' : 'bg-error') : 'bg-gray-200';
    const textColorCx = isCorrect !== null ? 'text-white' : 'text-gray-400';

    return (
        <div className={`flex  rounded-lg ${bgColorCx}`}>
            <div className="relative w-full">
                <input
                    type="text"
                    className={`input input-bordered font-mono w-full ${inputCx}`}
                    {...rest}
                />
                {canMeasure && (
                    <button
                        type="button"
                        className="absolute right-0 btn btn-toggle ml-2"
                        onClick={onMeasure}
                    >
                        <MdOutlineSwitchCamera className="text-2xl" />
                    </button>
                )}
            </div>
            {suffix && (
                <div className={`flex justify-center items-center text-xs aspect-square h-12 ${textColorCx}`}>
                    <span className="-mt-0.5">
                        {suffix}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ObservationInput;