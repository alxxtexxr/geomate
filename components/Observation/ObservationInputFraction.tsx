type Props = {
    inputA: JSX.Element,
    inputB: JSX.Element,
};

const ObservationInputFraction = ({ inputA, inputB }: Props) => (
    <div className="grid grid-cols-12 gap-2 border border-dashed border-gray-400 p-2 rounded-xl">
        <div className="col-span-12">
            {inputA}
        </div>
        <hr className="border-gray-800 col-span-12" />
        <div className="col-span-12">
            {inputB}
        </div>
    </div>
);

export default ObservationInputFraction;