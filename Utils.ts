import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary/lib/cloudinary';

// Types
import type { IncomingMessage } from 'http';
import type { Fields, Files, File } from 'formidable';

// Constants
import { SHAPES } from './Constants';

export const getShapeByI = (i: number) => SHAPES[i];

export const getShapeByCodename = (codename: string) => SHAPES.filter((SHAPE) => SHAPE.codename === codename)[0];

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

export const snakeToPascal = (string: string) => {
    return string.split("/")
        .map(snake => snake.split("_")
            .map(substr => substr.charAt(0)
                .toUpperCase() +
                substr.slice(1))
            .join(""))
        .join("/");
};

export const range = (size: number, startAt: number = 0): ReadonlyArray<number> => {
    return [...Array(size).keys()].map(i => i + startAt);
};

export const formatFormula = (formula: string) => {
    return formula
        .replaceAll('( ', '(')
        .replaceAll(' )', ')')
        .replaceAll('*', '×')
        .replaceAll(' / ', '/')
        .replaceAll(' ^ 2', '²')
        .replaceAll(' ^ 3', '³')
        .replaceAll('PI', 'π')
        ;
};

export const getS = (r: number, t: number) => +Math.sqrt(Math.pow(r, 2) + Math.pow(t, 2)).toFixed(2);