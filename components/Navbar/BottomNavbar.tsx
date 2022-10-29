import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
    menu: {
        icon: JSX.Element,
        activeIcon: JSX.Element,
        title: string,
        href: string,
    }[],
};

const BottomNavbar = ({ menu }: Props) => {
    const router = useRouter();

    const midI = Math.round(menu.length / 2);

    return (
        <nav className="fixed z-90 bottom-0 bg-white bg-opacity-90 w-screen rounded-t-2xl shadow">
            <ul className="flex text-center px-2">
                {menu.map((menuI, i) => i + 1 === midI ? (
                    <li key={menuI.href} className="flex-none -mt-8 -mx-2">
                        <Link href={menuI.href}>
                            <a className={
                                'btn btn-primary btn-circle btn-lg shadow-xl'
                            }>
                                    {menuI.icon}
                            </a>
                        </Link>
                    </li>
                ) : (
                    <li key={menuI.href} className="flex-1">
                        <Link href={menuI.href}>
                            <a className={
                                'flex flex-col items-center text-xs font-medium normal-case py-4' +
                                (
                                    router.pathname === menuI.href
                                        ? ' text-primary'
                                        : ' text-gray-800 hover:text-primary text-opacity-40 hover:text-opacity-100'
                                )
                            }>
                                <span className="mb-1">
                                {router.pathname === menuI.href ? menuI.activeIcon : menuI.icon}
                                </span>
                                {menuI.title}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BottomNavbar;