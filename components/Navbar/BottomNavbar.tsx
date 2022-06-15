import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
    menu: {
        icon: JSX.Element,
        title: string,
        href: string,
    }[],
};

const BottomNavbar = ({ menu }: Props) => {
    const router = useRouter();

    return (
        <nav className="fixed z-10 bottom-0 bg-white bg-opacity-95 w-screen p-4 rounded-t-xl shadow">
            <ul className="grid grid-cols-3 gap-4 text-center">
                {menu.map((menuI) => (
                    <li key={menuI.href}>
                        <Link href={menuI.href}>
                            <a className={
                                'flex flex-col items-center text-sm font-medium normal-case' +
                                (
                                    router.pathname === menuI.href
                                        ? ' text-primary'
                                        : ' text-gray-800 hover:text-primary text-opacity-40 hover:text-opacity-100'
                                )
                            }>
                                <span className="mb-1">
                                    {menuI.icon}
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