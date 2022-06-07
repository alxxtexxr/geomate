import { Parser } from 'expr-eval';

// Components
import ConditionalInput from './ConditionalInput';

// Utils
import { formatFormula, getS } from '../Utils';

// Constants
import { MATH_SYMBOLS } from '../Constants';

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

const CalculationSizeTab = ({ shape, form, setForm, onSubmit }: Props) => {
  // Function
  const assignValuesToFormula = (formula: string) => {
    let _formula = formula.toLowerCase().replaceAll('π', 'PI');

    // Object.keys(form).map((formKey) => {
    //   assignedValuesFormula = assignedValuesFormula.replaceAll(formKey, (form as { [key: string]: any })[formKey]);
    // })

    let _formulaArr = _formula.split(' ');
    _formulaArr = _formulaArr.map((_formulaArrI) => form.hasOwnProperty(_formulaArrI) ? (form as { [key: string]: any })[_formulaArrI] : _formulaArrI);
    _formula = _formulaArr.join(' ');

    return _formula;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: +e.target.value || 0,
      ...(e.target.name === 'r' ? { s: getS(+e.target.value, form.t || 0) } : {}),
      ...(e.target.name === 't' ? { s: getS(form.r, +e.target.value || 0) } : {}),
    });
  };

  // const correctV = assignValuesToFormula(shape.vFormula);
  // const correctLP = assignValuesToFormula(shape.lpFormula);
  const correctValues = {
    v: Parser.evaluate(shape.vFormula.toLowerCase(), form),
    lp: Parser.evaluate(shape.lpFormula.toLowerCase(), form),
  };

  console.log({ correctValues });

  return (
    <>
      {MATH_SYMBOLS.map(({ symbol, title }, i) => {
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
                    className="input input-bordered w-full"
                    disabled
                    value={formatFormula((shape as { [key: string]: any })[symbol.toLowerCase() + 'Formula'])}
                  />
                  <span className="text-sm font-semibold">
                    {symbol === 'V' ? 'cm³' : (symbol === 'LP' ? 'cm²' : 'cm')}
                  </span>
                </label>
                <label className="input-group mb-4">
                  <input
                    type="text"
                    placeholder="0"
                    className="input input-bordered w-full"
                    disabled
                    value={assignValuesToFormula(formatFormula((shape as { [key: string]: any })[symbol.toLowerCase() + 'Formula']))}
                  />
                  <span className="text-sm font-semibold">
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
        } else if ((shape.vFormula + shape.lpFormula).includes(symbol)) {
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
                    className="input input-bordered w-full"
                    value={(form as { [key: string]: any })[symbol.toLowerCase()]}
                    {...(symbol === 's' ? {
                      disabled: true
                    } : {
                      name: symbol.toLowerCase(),
                      onChange: handleChange
                    })}
                  />
                  <span className="text-sm font-semibold">
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
          correctValues.v === form.v &&
          correctValues.lp === form.lp
        ) ? (
          <button className="btn btn-primary w-full" onClick={onSubmit}>
            Selesaikan Observasi
          </button>
        ) : (
          <button className="btn w-full" disabled>
            Selesaikan Observasi
          </button>
        )}
      </div>
    </>
  );
};

export default CalculationSizeTab;