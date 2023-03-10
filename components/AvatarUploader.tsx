import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ImageUploading from 'react-images-uploading';
import { MdCameraAlt } from 'react-icons/md';
import { toast } from 'react-toastify';

// Components
import Avatar from './Avatar';
import LoadingSpinner from './LoadingSpinner';

// Utils
import { reloadSession } from '../Utils';

// Types
import type { ImageListType } from 'react-images-uploading';

const AvatarUploader = () => {
    const { data: session } = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const maxNumber = 1;

    const handleChange = async (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setIsLoading(true);
        setImages(imageList as never[]);

        if (imageList[0].file) {
            try {
                const image = imageList[0].file;
                const formData = new FormData();

                formData.append('image', image);

                await fetch(`/api/users/me/image`, {
                    method: 'PUT',
                    body: formData,
                });

                // Reload session
                reloadSession();

                // !!! If success, give message here !!!
                toast.success('Berhasil mengedit avatar!');
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error(error);
            }
        }
    };

    return (
        <ImageUploading
            multiple
            value={images}
            onChange={handleChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
        >
            {({
                imageList,
                onImageUpload,
                onImageUpdate,
                isDragging,
                dragProps,
            }) => (
                <div className="upload__image-wrapper relative inline-flex">
                    <div className="absolute right-0 bottom-0 z-20 transform translate-x-1/4 translate-y-1/4">
                        {isLoading ? (
                            <button className="btn btn-circle" disabled>
                                <LoadingSpinner />
                            </button>
                        ) : (
                        <button
                            className="btn btn-circle bg-white hover:bg-white text-primary hover:text-primary border-white hover:border-white shadow"
                            {...(imageList.length ? {
                                onClick: () => onImageUpdate(0),
                            } : {
                                style: isDragging ? { color: 'red' } : undefined,
                                onClick: onImageUpload,
                                ...dragProps,
                            })}
                        >
                            <MdCameraAlt className="text-2xl -mb-0.5" />
                        </button>
                        )}
                    </div>
                    <Avatar
                        src={imageList.length ? imageList[0]['data_url'] : session?.user.image}
                        alt={session?.user.name ? `${session?.user.name}'s Avatar` : undefined}
                        size="lg"
                    />
                </div>
    )
}
        </ImageUploading >
    );
};

export default AvatarUploader;