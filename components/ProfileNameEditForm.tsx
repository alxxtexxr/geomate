import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Sheet from 'react-modal-sheet';

// Components
import LoaderButton from './LoaderButton';

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

            // !!! If success, give message here !!!

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
            <Sheet.Container onViewportBoxUpdate>
                <Sheet.Header onViewportBoxUpdate />
                <Sheet.Content onViewportBoxUpdate>
                    <div className="px-4">
                        <div className="form-control w-full mb-4">
                            <label className="label text-sm">
                                <span className="label-text text-gray-800">Nama Lengkap</span>
                                <span className="label-text-alt text-gray-800">
                                    (NB: Ubah untuk edit)
                                </span>
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
                            <LoaderButton />
                        ) : (
                            name === session?.user.name ? (
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
            <Sheet.Backdrop onViewportBoxUpdate onTap={() => setIsOpen(false)} />
        </Sheet >
    );
};

export default ProfileNameEditForm;