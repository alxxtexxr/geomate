import { useState } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// Components
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import HomeMenuItem from '../components/HomeMenuItem';
import ShapeInformation from '../components/ShapeInformation';

// Constants
import { SHAPES, NAVBAR_BOTTOM_MENU } from '../Constants';

// Types
import type { GetServerSideProps } from 'next';
import type ComponentWithAuth from '../types/ComponentWithAuth';
import type { ShapeCode } from '@prisma/client';
import type HomeMenuItemT from '../types/HomeMenuItem';

type Props = {
	menu: HomeMenuItemT[],
};

const Home: ComponentWithAuth<Props> = ({ menu }) => {
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
					{menu.map((menuItem) => (
						<HomeMenuItem
							key={menuItem.code}
							{...menuItem}
							onClick={() => setSetectedShapeCode(menuItem.code)}
						/>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
	const headers = context.req.headers;

	const res = await fetch(`${process.env.NEXTAUTH_URL}/api/home-menu`, {
		headers: { 'Cookie': headers.cookie as string },
	});
	const menu = await res.json();

	return { props: { menu } };
};

export default Home;
