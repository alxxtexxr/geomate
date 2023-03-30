import type { ShapeCode } from '@prisma/client';

type HomeMenuItem = {
    code: ShapeCode, 
    name: string,
    isLocked: boolean,
};

export default HomeMenuItem;