import { MdRemove, MdAdd } from 'react-icons/md';

// Types
import { InputHTMLAttributes } from 'react';

type Props = {
    setValue: (n: number) => void,
};

const ObservationSpinner = ({ setValue, value, className: cx, ...rest }: Props & InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative flex-grow">
        <button
            type="button"
            className="absolute left-0 btn bg-transparent hover:bg-transparent hover:text-error border-0"
            onClick={() => setValue(value !== undefined ? +value - 1 : 0)}
        >
            <MdRemove className="text-2xl" />
        </button>
        <button
            type="button"
            className="absolute right-0 btn bg-transparent hover:bg-transparent hover:text-primary border-0"
            onClick={() => setValue(value !== undefined ? +value + 1 : 0)}
        >
            <MdAdd className="text-2xl" />
        </button>
        <input
            type="text"
            className={`input input-bordered flex-grow w-full mx-0.5 px-12 ${cx}`}
            value={value}
            {...rest}
        />
    </div>
);

export default ObservationSpinner;