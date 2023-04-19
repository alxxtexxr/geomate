import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ImageUploading from 'react-images-uploading';
import { MdEdit } from 'react-icons/md';

// Components
// import Navbar from '../../components/Navbar';
import Avatar from '../../components/Avatar';

// Types
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type { ChangeEvent } from 'react';
import type { ImageListType } from 'react-images-uploading';

const EditProfile: ComponentWithAuth = () => {
    const { data: session } = useSession();

    const [form, setForm] = useState({
        name: session?.user.name || '',
    });
    const [images, setImages] = useState([]);
    const maxNumber = 1;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleImageChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
    };

    return (
        <main>
            {/* <Navbar.Top title="Edit Profil" backHref="/profile" /> */}
            <section className="flex flex-col items-center px-4">
                <ImageUploading
                    multiple
                    value={images}
                    onChange={handleImageChange}
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
                        <div className="upload__image-wrapper relative inline-flex mb-4">
                            <div className="absolute right-0 bottom-0 z-20 transform translate-x-1/4 translate-y-1/4">
                                <button
                                    className="btn btn-circle bg-white hover:bg-white text-primary hover:text-primary border-white hover:border-white"
                                    {...(imageList.length ? {
                                        onClick: () => onImageUpdate(0),
                                    } : {
                                        style: isDragging ? { color: 'red' } : undefined,
                                        onClick: onImageUpload,
                                        ...dragProps,
                                    })}
                                >
                                    <MdEdit className="text-2xl" />
                                </button>
                            </div>
                            <Avatar
                                src={imageList.length ? imageList[0]['data_url'] : session?.user.image}
                                alt={session?.user.name ? `${session?.user.name}'s Avatar` : undefined}
                                size="lg"
                            />
                        </div>
                    )}
                </ImageUploading>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text text-gray-800">Nama Lengkap</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Ini Budi"
                        name="name"
                        value={form.name}
                        onChange={(e) => handleChange(e)}
                        className="input input-bordered w-full"
                    />
                </div>
            </section>

            <section className="absolute bottom-0 w-screen p-4">
                <button className="btn btn-primary w-full">Simpan Perubahan</button>
            </section>
        </main>
    );
};

EditProfile.auth = true;

export default EditProfile;