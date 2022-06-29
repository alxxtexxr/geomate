import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

// Components
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';

// Constants
import { SHAPES, NAVBAR_BOTTOM_MENU } from '../Constants';

// Types
import type ComponentWithAuth from '../types/ComponentWithAuth';

const Home: ComponentWithAuth = () => {
  const { data: session } = useSession();

  return (
    <main className="pb-20">
      {/* Header */}
      <header className="flex flex-col justify-center items-center text-center bg-base-200 text-primary-content pt-8 pb-14">
        <Avatar
          src={session?.user.image || undefined}
          alt={session?.user.name ? `${session?.user.name}'s Avatar` : undefined}
          size='lg'
        />
        <div className="mt-4">
          <h1 className="font-medium">Halo, {session?.user?.name || 'Kamu'}</h1>
          <p className="text-sm">Mau belajar apa hari ini?</p>
        </div>
      </header>

      {/* Menu */}
      <section className="p-4">
        <div className="grid grid-cols-2 gap-4 -mt-12">
          <Link href="/intro">
            <div className="animation col-span-2 flex justify-start items-center bg-white py-4 px-6 shadow rounded-xl">
              <div className="relative h-10 w-10 mr-4">
                <Image src="/images/intro.png" alt="KI/KD" layout="fill" />
              </div>
              <h2 className="font-medium text-gray-800">
                Pendahuluan
              </h2>
            </div>
          </Link>
          {SHAPES.map(({ id, name, code }) => (
            <Link href={`/stimulation/${code}`} key={id}>
              <div className="flex flex-col justify-center items-center bg-white py-8 shadow rounded-xl">
                <div className="relative h-20 w-20 mb-4">
                  <Image src={`/images/${code}.png`} alt={name} layout="fill" />
                </div>
                <h2 className="font-medium text-gray-800 -mb-1">
                  {name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Navbar Bottom */}
      <Navbar.Bottom menu={NAVBAR_BOTTOM_MENU} />
    </main>
  );
};

Home.auth = true;

export default Home;
