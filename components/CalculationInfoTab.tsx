// Utils
import { formatFormula } from '../Utils';

// Types
import type Shape from '../types/Shape';

type Props = {
    shape: Shape,
    onSubmit: () => void,
};

const CalculationInfoTab = ({ shape, onSubmit }: Props) => (
    <>
        <h1 className="text-lg font-semibold mb-3">{shape.name}</h1>
        <p className="text-sm mb-4">{shape.description}</p>

        <ul className="text-sm">
            <li className="flex justify-between py-4 border-t">
                <span>
                    Rumus Volume (V)
                </span>
                <span className="font-semibold">{formatFormula(shape.vFormula)}</span>
            </li>
            <li className="flex justify-between py-4 border-t">
                <span>
                    Rumus Luas Permukan (LP)
                </span>
                <span className="font-semibold">{formatFormula(shape.lpFormula)}</span>
            </li>
        </ul>

        <div className="fixed left-0 bottom-0 bg-white bg-opacity-95 w-screen p-4">
            <button className="btn btn-primary w-full" onClick={onSubmit}>
                SELANJUTNYA
            </button>
        </div>
    </>
);

export default CalculationInfoTab;