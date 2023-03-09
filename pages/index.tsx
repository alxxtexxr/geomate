import { useState } from 'react';
import Head from 'next/head'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

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
  const [isShapeInformationShowing, setIsShapeInformationShowing] = useState(false);

  return (
    <main className="bg-base-100 w-inherit min-h-screen">
      <Head>
        <title>Beranda | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>

      {/* Header */}
      <header className="flex flex-col justify-center items-center text-center bg-base-200 text-primary-content py-8 rounded-b-xl shadow">
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
        <div className="grid grid-cols-1 gap-4">
          {SHAPES.map((shape) => (
            <div
              className="flex items-center bg-white p-4 shadow rounded-2xl"
              onClick={() => {
                setSetectedShapeCode(shape.code);
                setIsShapeInformationShowing(true);
              }}
              key={shape.code}
            >
              <div className="relative h-10 w-10 mr-4">
                <Image src={`/images/${shape.code}.png`} alt={shape.name} layout="fill" />
              </div>
              <h2 className="font-medium text-gray-800">
                {shape.name}
              </h2>
            </div>
          ))}
        </div>
      </section>

      {/* Navbar Bottom */}
      <Navbar.Bottom menu={NAVBAR_BOTTOM_MENU} />

      {/* Shape Information */}
      {selectedShapeCode && (
        <ShapeInformation
          shapeCode={selectedShapeCode}
          isShowing={isShapeInformationShowing}
          setIsShowing={setIsShapeInformationShowing}
        />
      )}
    </main>
  );
};

Home.auth = true;

export default Home;
