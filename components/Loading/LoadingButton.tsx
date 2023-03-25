import { default as Spinner } from './LoadingSpinner';

const LoadingButton = () => (
    <button type="button" className="btn btn-block shadow-sm shadow-blue-800/10" disabled>
        <Spinner />
    </button>
);

export default LoadingButton;