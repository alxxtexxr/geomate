import { useState } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// Components
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import ShapeInformation from '../components/ShapeInformation';

// Constants
import { SHAPES, NAVBAR_BOTTOM_MENU } from '../Constants';

// Types
import type ComponentWithAuth from '../types/ComponentWithAuth';
import type { ShapeCode } from '@prisma/client';

const Home: ComponentWithAuth = () => {
  // Session
  const { data: session } = useSession();

  // State
  const [selectedShapeCode, setSetectedShapeCode] = useState<ShapeCode>();

  // Function
  const hideShapeInformation = () => setSetectedShapeCode(undefined);

  return (
    <main className="bg-base-100 w-inherit min-h-screen">
      <Head>
        <title>Beranda | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>

      {/* Header */}
      <header className="flex flex-col justify-center items-center text-center bg-base-200 text-primary-content pt-8 pb-14">
        <div className="relative flex">
          <Avatar
            src={session?.user.image || undefined}
            alt={session?.user.name ? `${session?.user.name}'s Avatar` : undefined}
            size='lg'
          />
        </div>
        <div className="mt-4">
          <h1 className="font-medium">{session?.user.name ? `Halo, ${session.user.name}!` : 'Halo!'}</h1>
          <p className="text-sm">Mau belajar apa hari ini?</p>
        </div>
      </header>

      {/* Menu */}
      <section className="p-4">
        <div className="grid grid-cols-2 gap-4 -mt-12">
          {SHAPES.map((shape) => (
            <div
              className="flex flex-col justify-center items-center bg-white py-8 rounded-2xl shadow-sm shadow-blue-800/20 cursor-pointer"
              onClick={() => setSetectedShapeCode(shape.code)}
              key={shape.code}
            >
              <div className="relative h-20 w-20 mb-4">
                <Image src={`/images/${shape.code}.png`} alt={shape.name} layout="fill" />
              </div>
              <h2 className="font-medium text-gray-800 -mb-1">
                {shape.name}
              </h2>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navbar */}
      <Navbar.Bottom menu={NAVBAR_BOTTOM_MENU} />

      {/* Shape Information */}
      <ShapeInformation
        shapeCode={selectedShapeCode}
        onHide={hideShapeInformation}
      />
    </main>
  );
};

Home.auth = true;

export default Home;
