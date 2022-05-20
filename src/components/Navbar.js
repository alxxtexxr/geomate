import { Link } from "react-router-dom";
import { IoArrowBackOutline } from 'react-icons/io5';

const Navbar = ({ backLinkTo }) => (
    <nav className="p-2">
        <Link to={backLinkTo}>
            <button className="btn btn-circle btn-ghost">
                <IoArrowBackOutline className="text-2xl" />
            </button>
        </Link>
    </nav>
);

export default Navbar;