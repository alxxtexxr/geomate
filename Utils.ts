import qs from 'qs';
import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary/lib/cloudinary';
import { Parser } from 'expr-eval';

// Types
import type { IncomingMessage } from 'http';
import type { Fields, Files, File } from 'formidable';
import type ObservationForm from './types/ObservationForm';

// Constants
import { SHAPES, MATH_SYMBOLS } from './Constants';

export const snakeToPascal = (string: string) =>
    string.split("/").map((snake) => snake.split("_")
        .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1)).join(""))
        .join("/");

export const range = (size: number, startAt: number = 0): ReadonlyArray<number> => {
    return [...Array(size).keys()].map(i => i + startAt);
};

export const round10 = (x: number) => Math.ceil(x / 10) * 10;

export const getInitials = (name: string) => {
    const nameArr = name.split(' ');

    return nameArr.length > 1
        ? nameArr[0] + ' ' + nameArr[1][0] + '.'
        : nameArr[0];
};

// Shape
export const getShape = (code: string) => SHAPES.filter((SHAPE) => SHAPE.code === code)[0];

// Math Symbol
export const getMathSymbol = (code: string) =>
    MATH_SYMBOLS.filter((MATH_SYMBOL) => MATH_SYMBOL.code === code)[0];

export const extractMathSymbolCodes = (formula: string, includePi = false) =>
    (includePi ? formula : formula.replace('pi', '')).match(/\b[a-zA-Z]+\b/g) || [];

// Base Shape Symbol
export const getBaseShapeSymbol = (nBaseVertices: number) => {
    const baseShapeSymbols: { [key: number]: string } = {
        3: '△',
        4: '□',
    };

    return baseShapeSymbols[nBaseVertices];
};
export const getBaseShapeName = (nBaseVertices: number) => {
    const baseShapeNames: { [key: number]: string } = {
        3: 'Segitiga',
        4: 'Persegi',
    };

    return baseShapeNames[nBaseVertices];
};

// Tensorflow
export const createImgElemement = (imgSrc: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, _) => {
        const img = new Image()
        img.crossOrigin = 'anonymous';
        img.src = imgSrc;
        img.onload = () => resolve(img);
    });
};

export const dataURItoBlob = (dataURI: string) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
};

// Prisma
export const reloadSession = () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event)
};

export const getQuery = ({ req }: { req: IncomingMessage | undefined }) => {
    return new Promise<{ [key: string]: string | string[]; }>((resolve) => {
        if (req && req.url) {
            resolve(qs.parse(req.url.split('?')[1]) as { [key: string]: string | string[] });
        }
    });
};

export const getImage = async (formData: IncomingMessage) => {
    const data: {
        fields: Fields,
        files: Files,
    } = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true });
        form.parse(formData, (err, fields, files) => {
            if (err) { return reject(err); }
            resolve({ fields, files });
        });
    });

    return data.files.image as File;
};

export const uploadImage = (image: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
            image,
            {},
            (err: any, res: any) => {
                if (err) reject(err);
                resolve(res);
            }
        );
    });
};

// Mensuration
export const splitFormula = (formula: string) => {
    const formulaArr = formula.split(' ');
    let formulaArrFiltered: string[] = [];

    formulaArr.map((formulaArrI) => {
        let isExist = false;

        MATH_SYMBOLS.map((mathSymbol, i) => {
            if (!isExist) {
                if (mathSymbol.code === formulaArrI) {
                    if (mathSymbol.symbol) {
                        formulaArrFiltered.push(mathSymbol.symbol);
                        isExist = true;
                    }
                } else {
                    if (i + 1 === MATH_SYMBOLS.length) {
                        formulaArrFiltered.push(formulaArrI);
                    }
                }
            }
        });
    });

    return formulaArrFiltered;
}

export const formatFormula = (formula: string) =>
    splitFormula(formula).join(' ')
        .replaceAll('( ', '(')
        .replaceAll(' )', ')')
        .replaceAll(' / ', '/')
        .replaceAll('*', '×')
        .replaceAll('^2', '²')
        .replaceAll('^3', '³')
        .replaceAll('pi', 'π')
    ;

export const formatFormulaToKatex = (formula: string) =>
    splitFormula(formula).join(' ')
        .replaceAll('( ', '(')
        .replaceAll(' )', ')')
        .replaceAll(' / ', '/')
        .replaceAll('*', '\\times')
        .replaceAll('pi', '\\pi')
        .replaceAll('1/3', '\\frac{1}{3}')
        .replaceAll('4/3', '\\frac{4}{3}')
    ;

export const getS = (r: number, t: number) => +Math.sqrt(Math.pow(r, 2) + Math.pow(t, 2)).toFixed(1);

export const evaluateFormula = (formula: string, form: ObservationForm) => {
    let _formula = formula;
    let _formulaArr = _formula.split(' ');

    _formulaArr = _formulaArr.map((_formulaArrI) => form.hasOwnProperty(_formulaArrI) ? (form as { [key: string]: any })[_formulaArrI] : _formulaArrI);
    _formula = _formulaArr.join(' ');

    return _formula;
};

export const checkFormula = (formula: string, correctFormula: string) => {
    const formulaArr = formula.replaceAll(' ', '').split('×').sort();
    const correctFormulaArr = correctFormula.replaceAll(' ', '').split('×').sort();

    if (formulaArr.length !== correctFormulaArr.length) {
        return false;
    }

    return formulaArr.every((mathSymbol, i) => mathSymbol === correctFormulaArr[i]);
};

export const inputValueToNumber = (inputValue: string) => {
    return inputValue.split('').filter(x => x === '.').length === 1
        ? inputValue
        : (
            +inputValue || 0
        )
};

// Gamification
const initXpLimit = 100;

export const getLevel = (xp: number) => xp < initXpLimit ? 1 : Math.floor((Math.log((xp - 1) / initXpLimit) / Math.log(1.5))) + 2;
export const getXpLimit = (level: number) => Math.floor(1.5 ** (level - 1) * initXpLimit);
export const getXpPct = (xp: number) => xp / getXpLimit(getLevel(xp)) * 100;

//
export const roundToNearest = (num: number, increment: number) => {
    return Math.round(num / increment) * increment;
};

export const floorToNearest = (num: number, increment: number) => {
    return Math.floor(num / increment) * increment
};

export const getPiString = (r: number | null) => r && !(r % 7) ? '22/7' : '3.14';
export const getPi = (r: number | null) => Parser.evaluate(getPiString(r))

// export const extractFormulaFractionParts = (str: string): string[] => {
//     return str.split("/").reduce((acc: string[], curr: string) => {
//         if (acc.length === 0 || acc[acc.length - 1].split("(").length === acc[acc.length - 1].split(")").length) {
//             acc.push(curr);
//         } else {
//             acc[acc.length - 1] += "/" + curr;
//         }
//         return acc;
//     }, []).map((part: string) => part.replace(/\(|\)/g, ""));
// }

export const extractFormulaFractionParts = (formula: string) => {
    let _formula = formula;
    if (_formula.startsWith('(')) { _formula = _formula.slice(0) }
    if (_formula.endsWith(')')) { _formula = _formula.slice(1, -1) }
    return _formula.split(')/(')
}