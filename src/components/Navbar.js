import { Link } from "react-router-dom";
import { IoArrowBackOutline } from 'react-icons/io5';

const Navbar = ({ backLinkTo }) => (
    <div className="p-2">
        <Link to={backLinkTo}>
            <button className="btn btn-circle btn-ghost">
                <IoArrowBackOutline className="text-2xl" />
            </button>
        </Link>
    </div>
);

export default Navbar;