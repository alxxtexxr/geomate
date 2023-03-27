import Spinner from './Spinner';

const LoaderButton = () => (
    <button className="btn w-full" disabled>
        <Spinner />
    </button>
);

export default LoaderButton;