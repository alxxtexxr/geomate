import Image from 'next/image';

const Logo = () => (
    <div className="flex items-center text-white">
        <div className="relative h-20 w-20 mr-2">
            <Image src="/images/logo.png"
                layout="fill"
                objectFit="contain"
            />
        </div>
        <h1 className="text-4xl">
            GeoMate
        </h1>
    </div>
);

export default Logo;