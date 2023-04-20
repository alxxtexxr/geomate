import { useState } from 'react';
import { Text, Plane } from '@react-three/drei';

// Components
import Button from './ARMeasurementDialogButton';

// Types
type Props = {
    messages: string[],
    position: number[],
    onConfirm: () => void,
    confirmText: string,
    onCancel: () => void,
    cancelText: string,
};

const XRMeasurementDialog = ({ messages, position, onConfirm, confirmText, onCancel, cancelText }: Props) => {
    const [isConfirmButtonHovered, setIsConfirmButtonHovered] = useState(false);
    const [isCancelButtonHovered, setIsCancelButtonHovered] = useState(false);

    const [x, y, z] = position;
    const w = 0.1;
    const h = 0.05;
    const fontSize = 0.02;

    return (
        <group>
            {/* Panel */}
            <group>
                <Plane args={[w * 2, h * 2]} position={[x, y + h * 1.5, z]}>
                    <meshStandardMaterial color="#292524" transparent opacity={0.6} />
                    {messages.map((message, i) => (
                        <Text
                            position={[
                                0,
                                (0.5 * (messages.length - (i + 1)) - (i + 1 - 1) / 2) *
                                fontSize,
                                0.01
                            ]}
                            fontSize={fontSize}
                            color="#FFFFFF"
                            anchorX="center"
                            anchorY="middle"
                            key={i}
                        >
                            {message}
                        </Text>
                    ))}
                </Plane>
            </group>

            {/* Confirm Button */}
            <Button
                onSelect={onConfirm}
                onHover={() => setIsConfirmButtonHovered(true)}
                onBlur={() => setIsConfirmButtonHovered(false)}
                args={[w, h]}
                position={[x - w / 2, y, z]}
                color="#3b82f6"
                opacity={isConfirmButtonHovered ? 1 : 0.6}
                fontSize={fontSize}
                textColor="#FFFFFF"
            >
                {confirmText}
            </Button>

            {/* Cancel Button */}
            <Button
                onSelect={onCancel}
                onHover={() => setIsCancelButtonHovered(true)}
                onBlur={() => setIsCancelButtonHovered(false)}
                args={[w, h]} 
                position={[x + w / 2, y, z]}
                color="#ef4444"
                opacity={isCancelButtonHovered ? 1 : 0.6}
                fontSize={fontSize}
                textColor="#FFFFFF"
            >
                {cancelText}
            </Button>
        </group>
    );
};

export default XRMeasurementDialog;