import LoadingSpinner from './LoadingSpinner';

const LoadingButton = () => (
    <button className="btn w-full" disabled>
        <LoadingSpinner />
    </button>
);

export default LoadingButton;