import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import { HiOutlineCube } from 'react-icons/hi';
import cx from 'classnames';

import Shape from '../components/Shape';
import Swap from '../components/Swap';

import { SHAPES } from '../Constants';

const Observation = () => {
  // Animate the 3D model
  const [{ rotation }, setRotation] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
  }))

  const bind = useDrag(({ delta, velocity, direction, memo = rotation.get() }) => {
    const x = memo[0] + (delta[1] / window.innerWidth) * 180;
    const y = memo[1] + (delta[0] / window.innerHeight) * 180;
    const vxyz = [direction[1] * (velocity[1] / 1), direction[0] * (velocity[0] / 1), 0];

    setRotation({
      rotation: [x, y, 0],
      config: { velocity: vxyz, decay: true }
    });

    return memo;
  });

  // Get selected shape
  let { shapeCodename } = useParams();
  const shape = SHAPES.filter((SHAPE) => SHAPE.codename === shapeCodename)[0];

  const [form, setForm] = useState({
    n_vertices: 0,
    n_edges: 0,
    n_faces: 0,
    PI: 3.14,
    r: 20,
    t: 20,
    s: 0,
    la: 0,
    lst: 0,
    ka: 0,
    v: 0,
    lp: 0,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [wireframe, setWireframe] = useState(false);

  // Functions
  const formatFormula = (formula) => formula
    .replaceAll('+', ' + ')
    .replaceAll('-', ' - ')
    .replaceAll('*', ' × ')
    .replaceAll('/', ' / ')
    .replaceAll('^2', '²')
    .replaceAll('^3', '³')
    .replaceAll('PI', 'π')
    ;

  const assignValuesToFormula = (formula) => {
    let assignedValuesFormula = formula.replaceAll('π', 'PI');

    Object.keys(form).map((formKey) => {
      assignedValuesFormula = assignedValuesFormula.replaceAll(formKey, form[formKey]);
    })

    return assignedValuesFormula;
  };


  const getS = (r, t) => Math.sqrt(Math.pow(r, 2) + Math.pow(t, 2)).toFixed(2)

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: +e.target.value,
      ...(e.target.name === 'r' ? { s: getS(e.target.value, form.t) } : {}),
      ...(e.target.name === 't' ? { s: getS(form.r, e.target.value) } : {}),
    });
  };

  const divideObjectValues = (obj, opd) => {
    const _obj = {...obj};
    
    for (let key in _obj) {
      if (typeof _obj[key] == 'number') {
        _obj[key] /= opd;
      }
    }

    return _obj;
  }

  // Constants
  const SIZE_VARS = [
    {
      symbol: 'r',
      title: 'Radius',
    },
    {
      symbol: 't',
      title: 'Tinggi',
    },
    {
      symbol: 's',
      title: 'Garis Pelukis',
    },
    {
      symbol: 'LA',
      title: 'Luas Alas',
    },
    {
      symbol: 'LST',
      title: 'Luas Sisi Tegak',
    },
    {
      symbol: 'KA',
      title: 'Keliling Alas',
    },
    {
      symbol: 'V',
      title: 'Volume',
    },
    {
      symbol: 'LP',
      title: 'Luas Permukaan'
    },
  ];
  const TABS = [
    {
      title: 'Informasi',
      content: (
        <>
          <h1 className="text-lg font-bold mb-3">{shape.name}</h1>
          <p className="text-sm mb-4">{shape.description}</p>

          <ul className="text-sm">
            <li className="flex justify-between py-4 border-t">
              <strong>Rumus Volume (V)</strong> <span>{formatFormula(shape.v_formula)}</span>
            </li>
            <li className="flex justify-between py-4 border-t">
              <strong>Rumus Luas Permukan (LP)</strong> <span>{formatFormula(shape.lp_formula)}</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: 'Sifat',
      content: (
        <>
          {/* N. of Vertices */}
          <div className="flex flex-row w-full mb-4">
            <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 12 }}>
              <span className="label-text">Jumlah Sudut</span>
            </label>
            <input
              type="text"
              placeholder="0"
              className="input input-bordered w-7/12"
              name="n_vertices"
              onChange={handleOnChange}
              value={form.n_vertices}
            />
          </div>

          {/* N. of Edges */}
          <div className="flex flex-row w-full mb-4">
            <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 12 }}>
              <span className="label-text">Jumlah Rusuk</span>
            </label>
            <input
              type="text"
              placeholder="0"
              className="input input-bordered w-7/12"
              name="n_edges"
              onChange={handleOnChange}
              value={form.n_edges}
            />
          </div>

          {/* N. of Faces */}
          <div className="flex flex-row w-full mb-4">
            <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 12 }}>
              <span className="label-text">Jumlah Sisi</span>
            </label>
            <input
              type="text"
              placeholder="0"
              className="input input-bordered w-7/12"
              name="n_faces"
              onChange={handleOnChange}
              value={form.n_faces}
            />
          </div>
        </>
      ),
    },
    {
      title: 'Ukuran',
      content: (
        <>
          {SIZE_VARS.map(({ symbol, title }, i) => {
            if (symbol === 'V' || symbol === 'LP') {
              return (
                <div className="flex flex-row w-full mb-4" key={i}>
                  <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 14 }}>
                    <span className="label-text">{title} ({symbol})</span>
                  </label>
                  <div className="w-7/12">
                    <input
                      type="text"
                      placeholder="0"
                      className="input input-bordered w-full mb-4"
                      disabled
                      value={formatFormula(shape[symbol.toLowerCase() + '_formula'])}
                    />
                    <input
                      type="text"
                      placeholder="0"
                      className="input input-bordered w-full mb-4"
                      disabled
                      value={assignValuesToFormula(formatFormula(shape[symbol.toLowerCase() + '_formula']))}
                    />
                    <input
                      type="text"
                      placeholder="0"
                      className="input input-bordered w-full"
                      name="v"
                      onChange={handleOnChange}
                      value={form.v}
                    />
                  </div>
                </div>
              );
            } else if ((shape.v_formula + shape.lp_formula).includes(symbol)) {
              return (
                <div className="flex flex-row w-full mb-4" key={i}>
                  <label className="label items-start w-5/12 pr-4" style={{ paddingTop: 14 }}>
                    <span className="label-text">{title} ({symbol})</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0"
                    className="input input-bordered w-7/12"

                    value={form[symbol.toLowerCase()]}
                    {...(symbol === 's' ? {
                      disabled: true
                    } : {
                      name: symbol.toLowerCase(),
                      onChange: handleOnChange
                    })}
                  />
                </div>
              );
            }
          })}
        </>
      ),
    },
  ];

  // Effects
  useEffect(() => {
    setForm({
      ...form,
      s: getS(form.r, form.t),
    })
  }, [])

  return (
    <main className="h-screen bg-neutral">

      <section {...bind()} className="sticky top-0 z-0 h-80" style={{ touchAction: 'none' }}>
        <Canvas>
          <ambientLight color="#888888" />
          <pointLight position={[10, 20, 0]} />
          {/* <Shape.Cone
            radius={form.r / 10}
            height={form.t / 10}
            rotation={rotation}
            wireframe={wireframe}
          /> */}
          <Shape
            codename={shape.codename}
            {...divideObjectValues(form, 10)}
            rotation={rotation}
            wireframe={wireframe}
          />
        </Canvas>

        <div className="absolute bottom-0 right-0 grid grid-cols-1 gap-2 p-4">
          <Swap
            isActive={wireframe}
            onClick={() => setWireframe(!wireframe)}
          >
            <HiOutlineCube className="text-2xl" />
          </Swap>
          <Swap>AR</Swap>
        </div>
      </section>

      <section className="relative z-10 flex flex-col flex-grow bg-white min-h-screen px-4 pt-2 pb-20 rounded-tl-xl rounded-tr-xl">
        <div className="tabs mb-4">
          {TABS.map(({ title }, i) => (
            <a
              className={cx('tab tab-bordered w-1/3 h-auto py-2 uppercase font-bold', {
                'text-primary border-primary': i === activeTab,
              })}
              onClick={() => setActiveTab(i)}
              key={i}
            >
              {title}
            </a>
          ))}
        </div>

        {TABS[activeTab].content}

        <div className="fixed left-0 bottom-0 bg-white bg-opacity-60 w-screen p-4">
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              if (activeTab < TABS.length) {
                setActiveTab(activeTab + 1);
              }
              // else
            }}>
            SELANJUTNYA
          </button>
        </div>
      </section>
    </main>
  );
};

export default Observation;
