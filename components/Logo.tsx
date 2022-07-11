import Image from 'next/image';

const Logo = () => (
    <div className="flex items-center text-white">
        <div className="relative h-20 w-20 mr-2">
            <Image src="/images/logo.png"
                layout="fill"
                objectFit="contain"
                alt={process.env.NEXT_PUBLIC_APP_NAME}
            />
        </div>
        <h1 className="text-4xl">
        {process.env.NEXT_PUBLIC_APP_NAME}
        </h1>
    </div>
);

export default Logo;