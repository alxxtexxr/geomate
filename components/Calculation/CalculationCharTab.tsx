// Components
import ConditionalSelect from '../ConditionalSelect';

// Utils
import { range } from '../../Utils';

// Types
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type Shape from '../../types/Shape';
import type CalculationForm from '../../types/CalculationForm';

type Props = {
    shape: Shape,
    form: CalculationForm,
    setForm: Dispatch<SetStateAction<CalculationForm>>,
    onSubmit: () => void,
};

const CalculationCharTab = ({ shape, form, setForm, onSubmit }: Props) => {
    const correctNVertices = (shape.codename === 'prism' || shape.codename === 'pyramid')
        ? (shape.codename === 'prism' ? form.nBaseVertices * 2 : (
            shape.codename === 'pyramid' ? form.nBaseVertices + 1 : form.nVertices
        ))
        : form.nVertices;
    const correctNEdges =
        (shape.codename === 'prism' || shape.codename === 'pyramid')
            ? (shape.codename === 'prism' ? form.nBaseVertices * 3 : (
                shape.codename === 'pyramid' ? form.nBaseVertices * 2 : form.nEdges
            ))
            : form.nEdges
        ;
    const correctNFaces =
        (shape.codename === 'prism' || shape.codename === 'pyramid')
            ? (shape.codename === 'prism' ? form.nBaseVertices * 3 : (
                shape.codename === 'pyramid' ? form.nBaseVertices * 2 : form.nFaces
            ))
            : form.nFaces;

    // Functions
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: +e.target.value,
        });
    };

    return (
        <div className="text-gray-500">
            {(shape.codename === 'prism' || shape.codename === 'pyramid') && (
                <div className="flex flex-row w-full mb-4">
                    <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 12 }}>
                        <span className="label-text">Bentuk Alas</span>
                    </label>
                    <select
                        className="select select-bordered w-7/12 font-normal"
                        name="nBaseVertices"
                        value={form.nBaseVertices}
                        onChange={handleChange}
                    >
                        {/* <option>Pilih bentuk</option> */}
                        <option value="3">Segitiga</option>
                        <option value="4">Persegi</option>
                    </select>
                </div>
            )}

            {/* N. of Vertices */}
            <div className="flex flex-row w-full mb-4">
                <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 12 }}>
                    <span className="label-text">Jumlah Sudut</span>
                </label>
                <ConditionalSelect
                    options={[
                        { title: 'Pilih nilai' },
                        ...range(11).map((i) => ({ title: i, value: i })),
                    ]}
                    correctOptionValue={'' + correctNVertices}
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
                        ...range(11).map((i) => ({ title: i, value: i })),
                    ]}
                    correctOptionValue={'' + correctNEdges}
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
                        ...range(11).map((i) => ({ title: i, value: i })),
                    ]}
                    correctOptionValue={'' + correctNFaces}
                    incorrectMessage="Nilai belum benar."
                    className="w-7/12"
                    name="nFaces"
                    value={form.nFaces}
                    onChange={(e) => handleChange(e)}
                />
            </div>

            <div className="fixed left-0 bottom-0 bg-white bg-opacity-95 w-screen p-4">
                {(
                    form.nVertices === correctNVertices &&
                    form.nEdges === correctNEdges &&
                    form.nFaces === correctNFaces
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
        </div>
    );
};

export default CalculationCharTab;