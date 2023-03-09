import { InputHTMLAttributes } from 'react';
import { MdOutlineSwitchCamera } from 'react-icons/md';

type Props = {
    title?: string,
    symbol?: string | null,
    suffix?: string | null,
    isCorrect?: boolean | null,
    canMeasure?: boolean,
};

const ObservationInput = ({ 
    title, 
    symbol = null, 
    suffix = null, 
    isCorrect = null,
    canMeasure = false, 
    ...rest 
}: Props & InputHTMLAttributes<HTMLInputElement>) => {
    const isCorrectCx = isCorrect !== null ? (isCorrect ? '  input-primary' : ' input-error') : '';

    return (
        <div className="grid grid-cols-3">
            <span className="label-text flex items-self-center items-center text-xs text-gray-800">
                {symbol && (
                    <div className="badge badge-primary badge-outline text-xs h-7 w-7 mr-2">
                        {symbol}
                    </div>
                )}
                {title}
            </span>
            <div className="col-span-2">
                <div className="flex bg-gray-200 rounded-lg">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className={'input input-bordered font-mono w-full' + isCorrectCx}
                            {...rest}
                        />
                        {canMeasure && (
                            <button type="button" className="absolute right-0 btn bg-transparent hover:bg-transparent hover:text-primary border-0 ml-2">
                                <MdOutlineSwitchCamera className="text-2xl" />
                            </button>
                        )}
                    </div>
                    {suffix && (
                        <div className="flex justify-center items-center text-xs text-gray-400 aspect-square h-12">
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

export default ObservationInput;