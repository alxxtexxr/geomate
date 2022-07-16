import * as THREE from 'three';
import { Interactive } from '@react-three/xr';
import { Text, Plane } from '@react-three/drei';

type Props = {
    onSelect: () => void,
    onHover: () => void,
    onBlur: () => void,
    args: [width?: number | undefined, height?: number | undefined, widthSegments?: number | undefined, heightSegments?: number | undefined] | undefined,
    position: number[] | undefined,
    color: string | undefined,
    opacity: number | undefined,
    fontSize: number | undefined,
    textColor: string | undefined,
    children: string,
}

const XRMeasurementDialogButton = ({ onSelect, onHover, onBlur, args, position, color, opacity, fontSize, textColor, children }: Props) => (
    <Interactive
        onSelect={onSelect}
        onHover={onHover}
        onBlur={onBlur}
    >
        <group>
            <Plane args={args} position={position && new THREE.Vector3().fromArray(position)}>
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={opacity}
                />
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={fontSize}
                    color={textColor}
                    anchorX="center"
                    anchorY="middle"
                >
                    {children}
                </Text>
            </Plane>
        </group>
    </Interactive>
);

export default XRMeasurementDialogButton;