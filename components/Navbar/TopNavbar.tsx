import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

type Props = {
    backHref?: string,
    title?: string,
    leftButton: JSX.Element,
};

const TopNavbar = ({ backHref, title, leftButton }: Props) => (
    <nav className="flex justify-between items-center p-2">
        {/* {backHref ? (
            <Link href={backHref}>
                <button className="btn btn-circle btn-ghost">
                    <MdArrowBack className="text-2xl" />
                </button>
            </Link>
        ) : (
            <div className="h-12 w-12" />
        )} */}
        {leftButton ? leftButton : (<div className="h-12 aspect-square" />)}
        {title && (
            <h1 className="font-semibold text-gray-800">{title}</h1>
        )}
        <div className="h-12 w-12" />
    </nav>
);

export default TopNavbar;