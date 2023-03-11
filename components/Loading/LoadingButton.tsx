import { default as Spinner } from './LoadingSpinner';

const LoadingButton = () => (
    <button className="btn w-full" disabled>
        <Spinner />
    </button>
);

export default LoadingButton;