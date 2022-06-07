// Components
import ConditionalSelect from '../components/ConditionalSelect';

// Utils
import { range } from '../Utils';

// Types
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type Shape from '../types/Shape';
import type CalculationForm from '../types/CalculationForm';

type Props = {
    shape: Shape,
    form: CalculationForm,
    setForm: Dispatch<SetStateAction<CalculationForm>>,
    onSubmit: () => void,
};

const CalculationCharTab = ({ shape, form, setForm, onSubmit }: Props) => {
    // Functions
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: +e.target.value,
        });
    };

    return (
        <>
            {/* N. of Vertices */}
            <div className="flex flex-row w-full mb-4">
                <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 12 }}>
                    <span className="label-text">Jumlah Sudut</span>
                </label>
                <ConditionalSelect
                    options={[
                        { title: 'Pilih nilai' },
                        ...range(5, -1).map((i) => ({ title: i, value: i })),
                    ]}
                    correctOptionValue={'' + shape.nVertices}
                    incorrectMessage="Nilai belum benar."
                    className="w-7/12"
                    name="nVertices"
                    value={form.nVertices}
                    onChange={(e) => handleChange(e)}
                />
            </div>

            {/* N. of Edges */}
            <div className="flex flex-row w-full mb-4">
                <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 12 }}>
                    <span className="label-text">Jumlah Rusuk</span>
                </label>
                <ConditionalSelect
                    options={[
                        { title: 'Pilih nilai' },
                        ...range(5, -1).map((i) => ({ title: i, value: i })),
                    ]}
                    correctOptionValue={'' + shape.nEdges}
                    incorrectMessage="Nilai belum benar."
                    className="w-7/12"
                    name="nEdges"
                    value={form.nEdges}
                    onChange={(e) => handleChange(e)}
                />
            </div>

            {/* N. of Faces */}
            <div className="flex flex-row w-full mb-4">
                <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 12 }}>
                    <span className="label-text">Jumlah Sisi</span>
                </label>
                <ConditionalSelect
                    options={[
                        { title: 'Pilih nilai' },
                        ...range(5, -1).map((i) => ({ title: i, value: i })),
                    ]}
                    correctOptionValue={'' + shape.nFaces}
                    incorrectMessage="Nilai belum benar."
                    className="w-7/12"
                    name="nFaces"
                    value={form.nFaces}
                    onChange={(e) => handleChange(e)}
                />
            </div>

            <div className="fixed left-0 bottom-0 bg-white bg-opacity-60 w-screen p-4">
                {(
                    form.nVertices === shape.nVertices &&
                    form.nEdges === shape.nEdges &&
                    form.nFaces === shape.nFaces
                ) ? (
                    <button className="btn btn-primary w-full" onClick={onSubmit}>
                        SELANJUTNYA
                    </button>
                ) : (
                    <button className="btn w-full" disabled>
                        SELANJUTNYA
                    </button>
                )}
            </div>
        </>
    );
};

export default CalculationCharTab;