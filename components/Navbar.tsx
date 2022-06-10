import Link from 'next/link';
import { IoArrowBackOutline } from 'react-icons/io5';

type Props = {
    backHref?: string,
    title?: string,
};

const Navbar = ({ backHref, title }: Props) => (
    <nav className="flex justify-between items-center p-2">
        {backHref ? (
            <Link href={backHref}>
                <button className="btn btn-circle btn-ghost">
                    <IoArrowBackOutline className="text-2xl" />
                </button>
            </Link>
        ) : (
            <div className="h-12 w-12" />
        )}
        {title && (
            <h1 className="font-semibold">{title}</h1>
        )}
        <div className="h-12 w-12" />
    </nav>
);

export default Navbar;