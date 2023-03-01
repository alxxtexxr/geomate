import { Parser } from 'expr-eval';

// Components
import ConditionalInput from '../ConditionalInput';
import Spinner from '../Spinner';

// Utils
import { formatFormula, assignFormToFormula, inputValueToNumber, getS } from '../../Utils';

// Constants
import { MATH_SYMBOLS } from '../../Constants';

// Types
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type Shape from '../../types/Shape';
import type ObservationForm from '../../types/ObservationForm';

type Props = {
  shape: Shape,
  form: ObservationForm,
  setForm: Dispatch<SetStateAction<ObservationForm>>,
  onSubmit: () => void,
  isSubmitting: boolean,
};

const MensurationSizeTab = ({ shape, form, setForm, onSubmit, isSubmitting }: Props) => {
  const correctValues = {
    v: +Parser.evaluate(shape.vFormula.toLowerCase(), form).toFixed(1),
    lp: +Parser.evaluate(shape.lpFormula.toLowerCase(), form).toFixed(1),
  };

  // Function
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: inputValueToNumber(e.target.value),
      ...(e.target.name === 'r' ? { s: getS(+e.target.value, form.t || 0) } : {}),
      ...(e.target.name === 't' ? { s: getS(form.r, +e.target.value || 0) } : {}),
    });
  };

  return (
    <>
      {MATH_SYMBOLS.map(({ title, code, symbol }, i) => {
        if (symbol === 'V' || symbol === 'LP') {
          return (
            <div className="flex flex-row w-full mb-4" key={i}>
              <label className="label items-start h-12 w-5/12 pr-4" style={{ paddingTop: 14 }}>
                <span className="label-text">{title} ({symbol})</span>
              </label>
              <div className="w-7/12">
                <label className="input-group mb-4">
                  <input
                    type="text"
                    placeholder="0"
                    className="input input-bordered w-1 flex-grow"
                    disabled
                    value={formatFormula((shape as { [key: string]: any })[symbol.toLowerCase() + 'Formula'])}
                  />
                  <span className="text-sm font-medium" style={{ width: 60 }}>
                    {symbol === 'V' ? 'cm³' : (symbol === 'LP' ? 'cm²' : 'cm')}
                  </span>
                </label>
                <label className="input-group mb-4">
                  <input
                    type="text"
                    placeholder="0"
                    className="input input-bordered w-1 flex-grow"
                    disabled
                    value={assignFormToFormula(form, formatFormula((shape as { [key: string]: any })[symbol.toLowerCase() + 'Formula']))}
                  />
                  <span className="text-sm font-medium" style={{ width: 60 }}>
                    {symbol === 'V' ? 'cm³' : (symbol === 'LP' ? 'cm²' : 'cm')}
                  </span>
                </label>
                <ConditionalInput
                  correctValue={'' + (correctValues as { [key: string]: any })[symbol.toLowerCase()]}
                  incorrectMessage="Nilai belum benar."
                  suffix={symbol === 'V' ? 'cm³' : (symbol === 'LP' ? 'cm²' : 'cm')}
                  onChange={handleChange}
                  name={symbol.toLowerCase()}
                  value={(form as { [key: string]: any })[symbol.toLowerCase()]}
                />
              </div>
            </div>
          );
        } else if ((shape.vFormula + shape.lpFormula).includes(code)) {
          return (
            <div className="flex flex-row w-full mb-4" key={i}>
              <label className="label items-start h-12 w-5/12 pr-4" style={{ paddingTop: 14 }}>
                <span className="label-text">{title} ({symbol})</span>
              </label>
              <div className="w-7/12">
                <label className="input-group">
                  <input
                    type="text"
                    placeholder="0"
                    className="input input-bordered w-1 flex-grow"
                    value={(form as { [key: string]: any })[code.toLowerCase()]}
                    {...(symbol === 's' ? {
                      disabled: true
                    } : {
                      name: code.toLowerCase(),
                      onChange: handleChange
                    })}
                  />
                  <span className="text-sm font-medium" style={{ width: 60 }}>
                    {symbol === 'V' ? 'cm³' : (symbol === 'LP' ? 'cm²' : 'cm')}
                  </span>
                </label>
              </div>
            </div>
          );
        }
      })}

      <div className="fixed left-0 bottom-0 z-20 bg-white bg-opacity-95 w-screen p-4">
        {(
          correctValues.v === +form.v &&
          correctValues.lp === +form.lp
        ) ? (
          isSubmitting ? (
            <button className="btn w-full" disabled>
              <Spinner />
            </button>
          ) : (
            <button className="btn btn-primary w-full" onClick={onSubmit}>
              Selesaikan Observasi
            </button>
          )

        ) : (
          <button className="btn w-full" disabled>
            Selesaikan Observasi
          </button>
        )}
      </div>
    </>
  );
};

export default MensurationSizeTab;