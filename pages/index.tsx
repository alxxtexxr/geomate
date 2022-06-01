import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import Shape from '../types/Shape';

type Props = {
  shapes: Shape[],
};

const Home: React.FC<Props> = ({ shapes }) => {
  const { data: session } = useSession();

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
            <Link href={`/stimulation/${codename}`} key={id}>
              <div className="flex flex-col justify-center items-center bg-white py-8 shadow rounded-xl">
                <div className="relative h-20 w-20 mb-4">
                  <Image src={`/images/${codename}.png`} alt={name} layout="fill" />
                </div>
                <h2 className="font-bold">
                  {name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/shapes`);
  const shapes = await res.json();

  return {
    props: { shapes },
  };
};

export default Home;
