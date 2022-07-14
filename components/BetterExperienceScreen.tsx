import QRCode from 'react-qr-code';

type Props = {
    onClose: () => void,
}

const BetterExperienceScreen = ({ onClose }: Props) => (
    <div className="fixed z-10 inset-0 flex justify-center items-center text-center w-screen h-screen bg-base-200 bg-opacity-95 text-white">
        {/* <div> */}

        <div className="w-96">
            {/* <h1 className="font-medium mb-1">Bukalah di Smartphone</h1> */}
            <div className="inline-flex bg-white p-4 mb-4 rounded-xl shadow">
                <QRCode value={window.location.href} size={176} />
            </div>
            <div className="text-xs mb-4">Bukalah di smartphone untuk pengalaman yang lebih baik. Cukup dengan menge-scan QR code di atas.</div>
            <div className="divider divider-white text-xs">atau</div>

            <button
                className="btn btn-outline hover:bg-white text-white hover:text-primary border-white hover:border-white"
                onClick={onClose}>
                Tetap Akses di Desktop
            </button>
        </div>
        {/* </div> */}
    </div>
);

export default BetterExperienceScreen;