import { InputHTMLAttributes } from 'react';
import { MdOutlineSwitchCamera } from 'react-icons/md';

type Props = {
    title?: string,
    symbol?: string | null,
    suffix?: string | null,
    isCorrect?: boolean | null,
    canMeasure?: boolean,
};

const BG_CX_MAP = {

}

const ObservationFormControl = ({
    title,
    symbol = null,
    suffix = null,
    isCorrect = null,
    canMeasure = false,
    ...rest
}: Props & InputHTMLAttributes<HTMLInputElement>) => {
    const inputCx = isCorrect !== null ? (isCorrect ? 'input-primary' : 'input-error') : '';
    const bgColorCx = isCorrect !== null ? (isCorrect ? 'bg-primary' : 'bg-error') : 'bg-gray-200';
    const textColorCx = isCorrect !== null ? 'text-white' : 'text-gray-400';

    return (
        <div className="grid grid-cols-3">
            <span className="label-text flex items-self-center items-center text-sm text-gray-800 pr-2">
                {symbol && (
                    <div className="badge badge-primary badge-outline text-xs h-7 w-7 mr-2">
                        {symbol}
                    </div>
                )}
                {title}
            </span>
            <div className="col-span-2">
                <div className={`flex  rounded-lg ${bgColorCx}`}>
                    <div className="relative w-full">
                        <input
                            type="text"
                            className={`input input-bordered font-mono w-full ${inputCx}`}
                            {...rest}
                        />
                        {canMeasure && (
                            <button type="button" className="absolute right-0 btn btn-toggle ml-2">
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
            </div>
        </div>
    );
};

export default ObservationFormControl;