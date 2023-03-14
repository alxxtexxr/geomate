import { MutableRefObject, SetStateAction, Dispatch } from 'react';
import Keyboard, { KeyboardLayoutObject } from 'react-simple-keyboard';

// Style
import 'react-simple-keyboard/build/css/index.css';

// Types
import type ObservationFormValues from '../../types/ObservationFormValues';

type ObservationKeyboardProps = {
    keyboardRef: MutableRefObject<null>,
    layout: KeyboardLayoutObject,
    form: ObservationFormValues,
    focusedInputName: string | null,
    setFocusedInputName: Dispatch<SetStateAction<string | null>>,
    onChange: ((input: string, e?: MouseEvent | undefined) => any),
};

const ObservationKeyboard = ({ keyboardRef, layout, form, focusedInputName, setFocusedInputName, onChange }: ObservationKeyboardProps) => (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-200 bg-opacity-95 w-inherit rounded-t-lg">
        <Keyboard
            keyboardRef={(r) => (keyboardRef.current = r)}
            layout={layout}
            display={{
                '{bksp}': 'Hapus',
            }}
            buttonTheme={[
                {
                    class: 'w-5-important',
                    buttons: '{bksp} .'
                },
            ]}
            onChange={onChange}
            onRender={(r) => {
                if (focusedInputName) {
                    const focusedInputValue = (form as ObservationFormValues)[focusedInputName];
                    r?.setInput(focusedInputValue ? '' + focusedInputValue : '');
                }
            }}
        />
        <div className="px-2 pb-2">
            <button
                className="btn btn-primary btn-block min-h-10 h-10 animate-none"
                type="button"
                onClick={() => setFocusedInputName(null)}
            >
                Tutup
            </button>
        </div>
    </div>
);

export default ObservationKeyboard;