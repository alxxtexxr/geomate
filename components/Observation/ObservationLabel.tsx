// Types
type Props = {
    children?: string,
    symbol?: string | null,
};

const ObservationLabel = ({children, symbol = null}: Props) => (
    <span className="label-text flex items-center text-sm text-gray-800 pr-2">
        {symbol && (
            <div className="badge badge-primary badge-outline text-xs h-7 w-7 mr-2">
                {symbol}
            </div>
        )}
        {children}
    </span>
);

export default ObservationLabel;