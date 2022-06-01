import Link from 'next/link';
import { IoArrowBackOutline } from 'react-icons/io5';

const Navbar = ({ backHref }) => (
    <nav className="p-2">
        <Link href={backHref}>
            <button className="btn btn-circle btn-ghost">
                <IoArrowBackOutline className="text-2xl" />
            </button>
        </Link>
    </nav>
);

export default Navbar;