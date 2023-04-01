type Props = {
    children: string,
}

const ObservationInputOp = ({ children }: Props) => (
    <div className="grid grid-cols-3 -my-2">
        <div className="col-start-2 col-span-2 text-center">
            {children}
        </div>
    </div>
);

export default ObservationInputOp;