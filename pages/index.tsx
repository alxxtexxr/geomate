import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

type Shape = {
  id: string;
  codename: string;
  name: string;
  stimulation: string;
  stimulationImageUrl: string;
  problemIdentification: string;
  problemIdentificationImageUrl: string;
  nVertices: number;
  nEdges: number;
  nFaces: number;
  vFormula: string;
  lpFormula: string;
};

type Props = {
  shapes: Shape[]
};

const Home: React.FC<Props> = ({ shapes }) => {
  const { data: session } = useSession();

  console.log({ session })

  return (
    <main className="bg-base-200 min-h-screen">
      {/* Header */}
      <header className="flex flex-col justify-center text-center bg-primary-content pt-8 pb-14">
        <div className="mb-4">
          <div className="avatar">
            <div
              className="relative h-24 w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
              style={{ backgroundColor: '#C4C5C9' }}
            >
              <Image
                src={session?.user?.image || '/images/default-user-image.jpeg'}
                alt={session?.user?.image || ''}
                layout="fill"
              />
            </div>
          </div>
        </div>
        <h1 className="font-bold">Halo, {session?.user?.name || 'Kamu'}</h1>
        <p className="text-sm">Mau belajar apa hari ini?</p>
      </header>

      {/* Menu */}
      <section className="p-4">
        <div className="grid grid-cols-2 gap-4 -mt-12">
          <div className="animation col-span-2 flex justify-start items-center bg-white py-4 px-6 shadow rounded-xl">
            <div className="relative h-10 w-10 mr-4">
              <Image src="/images/kikd.png" alt="KI/KD" layout="fill" />
            </div>
            <h2 className="font-bold">
              KI/KD
            </h2>
          </div>
          {shapes.map(({ id, name, codename }) => (
            <div key={id}>
              <div className="flex flex-col justify-center items-center bg-white py-8 shadow rounded-xl">
                <div className="relative h-20 w-20 mb-4">
                  <Image src={`/images/${codename}.png`} alt={name} layout="fill" />
                </div>
                <h2 className="font-bold">
                  {name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/shapes');
  const shapes = await res.json();

  return {
    props: { shapes },
  };
};

export default Home;