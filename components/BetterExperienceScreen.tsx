import QRCode from 'react-qr-code';

// Components
import Overlay from './Overlay';

// Types
type Props = {
    onClose: () => void,
}

const BetterExperienceScreen = ({ onClose }: Props) => (
    <Overlay.Primary>
        <div className="w-96">
            <div className="inline-flex bg-white p-4 mb-4 rounded-xl">
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
    </Overlay.Primary>
);

export default BetterExperienceScreen;