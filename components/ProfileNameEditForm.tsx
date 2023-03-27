import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Sheet from 'react-modal-sheet';
import { toast } from 'react-toastify';

// Components
import LoadingButton from './Loading/LoadingButton';

// Utils
import { reloadSession } from '../Utils';

// Types
import { Dispatch, SetStateAction } from 'react';

type Props = {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}

const ProfileNameEditForm = ({ isOpen, setIsOpen }: Props) => {
    // Session
    const { data: session } = useSession();

    // States
    const [name, setName] = useState(session?.user.name);
    const [isLoading, setIsLoading] = useState(false);

    // Functions
    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            await fetch(`/api/users/me`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                }),
            });

            reloadSession();

            toast.success('Berhasil mengedit nama lengkap!');

            setIsOpen(false);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    };

    return (
        <Sheet
            snapPoints={[204]}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                    <div className="px-4">
                        <div className="form-control w-full mb-4">
                            <label className="label text-gray-800 text-sm">
                                <span className="label-text">Nama Lengkap</span>
                                {/* <span className="label-text-alt">
                                    (NB: Ubah untuk edit)
                                </span> */}
                            </label>
                            <input
                                type="text"
                                placeholder="Budi"
                                value={name || ''}
                                onChange={(e) => setName(e.target.value)}
                                className="input input-bordered w-full"
                            />
                        </div>
                        {isLoading ? (
                            <LoadingButton />
                        ) : (
                            name === '' || name === session?.user.name ? (
                                <button className="btn w-full" disabled>
                                    Edit
                                </button>
                            ) : (
                                <button className="btn btn-primary w-full" onClick={handleSubmit}>
                                    Edit
                                </button>
                            )
                        )}
                    </div>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => setIsOpen(false)} />
        </Sheet >
    );
};

export default ProfileNameEditForm;