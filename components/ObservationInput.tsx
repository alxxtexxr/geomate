import { InputHTMLAttributes } from 'react';
import { MdOutlineSwitchCamera } from 'react-icons/md';

type Props = {
    title: string,
    symbol: string,
    suffix: string,
    canMeasure?: boolean,
};

const ObservationInput = ({ title, symbol, suffix, canMeasure = false, ...rest }: Props & InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <div className="grid grid-cols-3">
            <span className="label-text flex items-self-center items-center text-xs text-gray-800">
                <div className="badge badge-primary badge-outline text-xs h-7 w-7 mr-2">
                    {symbol}
                </div>
                {title}
            </span>
            <div className="col-span-2">
                <div className="flex bg-gray-200 rounded-lg">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="input input-bordered text-xs w-full"
                            {...rest}
                        />
                        {canMeasure && (
                            <button type="button" className="absolute right-0 btn bg-transparent hover:bg-transparent hover:text-primary border-0 ml-2">
                                <MdOutlineSwitchCamera className="text-2xl" />
                            </button>
                        )}
                    </div>
                    <div className="flex justify-center items-center text-xs text-gray-400 aspect-square h-12">
                        <span className="-mt-0.5">
                            {suffix}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObservationInput;