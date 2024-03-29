import { useState } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { MdInfo } from 'react-icons/md';
import Link from 'next/link';

// Components
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import LevelIndicator from '../components/LevelIndicator';
import HomeMenu from '../components/HomeMenu';
import ShapeInformation from '../components/ShapeInformation';

// Constants
import { NAVBAR_BOTTOM_MENU } from '../Constants';

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

	// Functions
	const hideShapeInformation = () => setSetectedShapeCode(undefined);
	const selectShapeCode = (menuItem: HomeMenuItemT) => setSetectedShapeCode(menuItem.code);

	return (
		<main className="bg-base-100 w-inherit min-h-screen">
			<Head>
				<title>Beranda | {process.env.NEXT_PUBLIC_APP_NAME}</title>
			</Head>

			<header className="flex flex-col text-primary-content">
				<div className="flex items-center bg-base-200 pt-6 px-10 pb-16">
					<div className="flex mr-4">
						<Avatar
							src={session?.user.image || undefined}
							alt={session?.user.name ? `${session?.user.name}'s Avatar` : undefined}
							size='lg'
						/>
					</div>
					<div className="-mt-px">
						<h1 className="text-xl font-medium">{session?.user.name ? `Halo, ${session.user.name.split(' ')[0]}!` : 'Halo!'}</h1>
						<p className="text-sm">Mau belajar apa hari ini?</p>
					</div>
				</div>

				<div className="-mt-10 px-4">
					<LevelIndicator xp={session?.user.xp || 0} />
				</div>
			</header>

			<section className="grid grid-cols-1 gap-4 p-4">
				<Link href="/guides">
					<div className="flex bg-white p-6 rounded-2xl shadow-sm shadow-blue-800/20">
						<MdInfo className="text-primary text-2xl mr-4" />
						<span className="font-medium text-gray-800">
							Petunjuk
						</span>
					</div>
				</Link>
				<HomeMenu menu={menu} onItemClick={selectShapeCode} />
			</section>

			<Navbar.Bottom menu={NAVBAR_BOTTOM_MENU} />
			<ShapeInformation shapeCode={selectedShapeCode} onHide={hideShapeInformation} />
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
