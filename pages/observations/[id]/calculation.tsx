import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import { HiOutlineCube } from 'react-icons/hi';
import cx from 'classnames';
import Router from 'next/router';

// Components
import ShapeComponent from '../../../components/Shape';
import Swap from '../../../components/Swap';
import InfoTab from '../../../components/Calculation/CalculationInfoTab';
import CharTab from '../../../components/Calculation/CalculationCharTab';
import SizeTab from '../../../components/Calculation/CalculationSizeTab';

// Utils
import { getShapeByCodename, getS } from '../../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../../../types/ComponentWithAuth';
import type Shape from '../../../types/Shape';
import type Observation from '../../../types/Observation';
import type CalculationForm from '../../../types/CalculationForm';

type Props = {
  observation: Observation,
  shape: Shape,
};

const Calculation: ComponentWithAuth<Props> = ({ observation, shape }) => {
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

  // States
  const [form, setForm] = useState<CalculationForm>({
    nBaseVertices: 3,
    nVertices: 0,
    nEdges: 0,
    nFaces: 0,
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Functions
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await fetch(`/api/observations/${observation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      await Router.push(`/observations/${observation.id}`);
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
    }
  }

  // Constants
  const TABS = [
    {
      title: 'Informasi',
      content: (<InfoTab shape={shape} onSubmit={() => setActiveTab(1)} />),
    },
    {
      title: 'Sifat',
      content: (<CharTab shape={shape} form={form} setForm={setForm} onSubmit={() => setActiveTab(2)} />),
    },
    {
      title: 'Ukuran',
      content: (<SizeTab shape={shape} form={form} setForm={setForm} isSubmitting={isSubmitting} onSubmit={handleSubmit} />),
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
          <ShapeComponent
            codename={shape.codename}
            {...form}
            r={form.r / 10}
            t={form.t / 10}
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
          <Swap onClick={() => { }}>AR</Swap>
        </div>
      </section>

      <section className="relative z-10 flex flex-col flex-grow min-h-screen">
        <div className="tabs sticky top-0 z-20 bg-white pt-2 px-4 rounded-tl-xl rounded-tr-xl">
          {TABS.map(({ title }, i) => (
            <a
              className={cx('tab tab-bordered w-1/3 h-auto py-2 uppercase font-semibold', {
                'text-gray-400 border-gray-200': i !== activeTab,
                'text-primary border-primary': i === activeTab,
              })}
              key={i}
            >
              {title}
            </a>
          ))}
        </div>

        <div className="flex-grow bg-white pt-4 pb-20 px-4">
          {TABS[activeTab].content}
        </div>
      </section>
    </main>
  );
};

Calculation.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context?.params?.id || null;

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/observations/${id}`);
  const observation = await res.json();
  const shape = getShapeByCodename(observation.shapeCodename);

  return { props: { observation, shape } };
};

export default Calculation;
