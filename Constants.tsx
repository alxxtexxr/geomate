import { MdOutlineHome, MdInfoOutline, MdOutlineLeaderboard, MdOutlinePersonOutline, MdHome, MdLeaderboard, MdPerson, MdInfo } from 'react-icons/md';
import { AiOutlineScan } from 'react-icons/ai'

// Types
import Shape from './types/Shape';
import MathSymbol from './types/MathSymbol';
import { KeyboardLayoutObject } from 'react-simple-keyboard';

// Shape descriptions is from mathway.com
export const NEXT_SHAPE_CODE_MAP: { [key: string]: string } = {
  cylinder: 'cone',
  cone: 'sphere',
};

export const SHAPE_NAME_MAP: { [key: string]: string } = {
  cylinder: 'Tabung',
  cone: 'Kerucut',
  sphere: 'Bola',
};

export const SHAPES: Shape[] = [
  {
    code: 'cylinder',
    name: SHAPE_NAME_MAP['cylinder'],
    description: 'Bangun tiga-dimensi yang mempunyai dua alas sejajar dan keduanya lingkaran yang kongruen.',
    vFormula: 'pi*r^2*t',
    vFormulaUndiscovered: 'V_{tabung} = Luas\\ Alas \\times t',
    vFormulaUndiscoveredMathSymbols: ['baseArea', 't'],
    vFormulaDiscovered: 'V_{tabung} = \\pi \\times r^2 \\times t',

    // v2.x
    introductionMessages: [
      {
        message: 'Pernahkah kamu bertanya-tanya, bagaimana sih cara menghitung volume benda tabung?',
        reply: 'Memang bagaimana?',
        image: 'https://paragram.id/upload/media/entries/2020-05/26/15702-2-ed79a264a10471ecff72dfd215f8f91f.jpg',
      },
      {
        message: 'Jika kamu ingin tahu, kita dapat mempelajarinya!',
        reply: 'Baiklah',
      },
      {
        message: 'Carilah benda tabung di sekitarmu seperti kaleng, toples, atau botol.',
        reply: 'OK, sudah',
      },
      {
        message: 'Langkah selanjutnya, kita akan melakukan observasi dan mencari tahu bagaimana sih volume benda tersebut dihitung',
        reply: 'OK, mulai saja!',
      },
    ],
  },
  {
    code: 'cone',
    name: SHAPE_NAME_MAP['cone'],
    description: 'Bangun tiga-dimensi dengan alas lingkaran dan satu verteks.',
    vFormula: '(pi*r^2*t)/(3)',
    vFormulaUndiscovered: 'V_{kerucut} = \\dfrac{V_{tabung}}{3}',
    vFormulaDiscovered: 'V_{kerucut} = \\dfrac{\\pi \\times r^2 \\times t}{3}',

    // v2.x
    introductionMessages: [
      {
        message: 'Pernahkah kamu bertanya-tanya, bagaimana sih menghitung volume benda kerucut?',
        reply: 'Memang bagaimana?',
      },
      {
        message: 'Jika kamu ingin tahu, kita dapat mempelajarinya!',
        reply: 'Baiklah',
      },
      {
        message: 'Carilah benda kerucut di sekitarmu seperti topi ulang tahun, tutup saji, atau cone es krim',
        reply: 'Baik, sudah',
      },
      {
        message: 'Langkah selanjutnya, kita akan melakukan observasi dan mencari tahu bagaimana sih volume benda tersebut dihitung',
        reply: 'OK, Mulai saja!',
      },
    ],
  },
  {
    code: 'sphere',
    name: SHAPE_NAME_MAP['sphere'],
    description: 'Bangun tiga dimensi dengan semua titik dalam ruang berjarak tetap dari titik tertentu, yang disebut pusat.',
    vFormula: '(4*pi*r^3)/(3)',
    vFormulaUndiscovered: 'V_{bola} = 4 \\times V_{kerucut}',
    vFormulaDiscovered: 'V_{bola} = \\dfrac{4 \\times \\pi \\times r^2 \\times t}{3}',

    // v2.x
    introductionMessages: [
      {
        message: 'Pernahkah kamu bertanya-tanya, bagaimana sih menghitung volume benda bola?',
        reply: 'Memang bagaimana?',
      },
      {
        message: 'Jika kamu ingin tahu, kita dapat mempelajarinya!',
        reply: 'Baiklah',
      },
      {
        message: 'Carilah benda bola di sekitarmu seperti bola sepak, kelereng, atau balon.',
        reply: 'Baik, sudah',
      },
      {
        message: 'Langkah selanjutnya, kita akan melakukan observasi dan mencari tahu bagaimana sih volume benda tersebut dihitung',
        reply: 'OK, Mulai saja!',
      },
    ],
  },
];

export const MATH_SYMBOLS: MathSymbol[] = [
  {
    symbol: 'π',
    code: 'pi',
    title: 'Pi',
  },
  {
    symbol: 'r',
    code: 'r',
    title: 'Radius',
    defaultValue: 14,
  },
  {
    symbol: 't',
    code: 't',
    title: 'Tinggi',
    defaultValue: 20,
  },
  {
    symbol: 'V',
    code: 'v',
    title: 'Volume',
  },
  {
    symbol: 'L',
    code: 'baseArea',
    title: 'Luas Alas',
  },
];

export const NAVBAR_BOTTOM_MENU = [
  {
    icon: (<MdOutlineHome className="text-2xl" />),
    activeIcon: (<MdHome className="text-2xl" />),
    title: 'Beranda',
    href: '/',
  },
  {
    icon: (<MdInfoOutline className="text-2xl" />),
    activeIcon: (<MdInfo className="text-2xl" />),
    title: 'Pengantar',
    href: '/guides',
  },
  {
    icon: (<AiOutlineScan className="text-3xl" />),
    activeIcon: (<AiOutlineScan className="text-3xl" />),
    title: 'Scanner',
    href: '/classification',
  },
  {
    icon: (<MdOutlineLeaderboard className="text-2xl" />),
    activeIcon: (<MdLeaderboard className="text-2xl" />),
    title: 'Peringkat',
    href: '/leaderboard',
  },
  {
    icon: (<MdOutlinePersonOutline className="text-2xl" />),
    activeIcon: (<MdPerson className="text-2xl" />),
    title: 'Profil',
    href: '/profile',
  },
];

export const GUIDES = [
  {
    title: 'Kompetensi Inti',
    contents: [
      {
        no: '3',
        content: 'Memahami pengetahuan faktual dan konseptual dengan cara mengamati, menanya, dan mencoba berdasarkan rasa ingin tahu tentang dirinya, makhluk ciptaan Tuhan, dan kegiatannya, dan benda-benda yang dijumpainya di rumah, di sekolah, dan tempat bermain.',
      },
      {
        no: '4',
        content: 'Menyajikan pengetahuan faktual dan konseptual dalam bahasa yang jelas, sistematis, logis, dan kritis, dalam karya yang estetis, dalam gerakan yang mencerminkan anak sehat, dalam tindakan yang mencerminkan perilaku anak beriman dan berakhlak mulia.',
      },
    ],
  },
  {
    title: 'Kompetensi Dasar',
    contents: [
      {
        no: '3',
        content: 'Membandingkan prisma, tabung, limas, kerucut, dan bulat.',
      },
      {
        no: '4',
        content: 'Mengidentifikasi prisma, tabung,limas, kerucut, dan bulat.',
      },
    ],
  },
  {
    title: 'Indikator',
    contents: [
      {
        no: '3.6.1',
        content: 'Memahami bangun ruang prisma.',
      },
      {
        no: '3.6.2',
        content: 'Mengetahui bangun ruang limas.',
      },
      {
        no: '3.6.3',
        content: 'Mengerti bangun ruang tabung.',
      },
      {
        no: '3.6.4',
        content: 'Memahami bangun ruang kerucut.',
      },
      {
        no: '3.6.5',
        content: 'Mengetahui bangun ruang bulat.',
      },
      {
        no: '4.6.1',
        content: 'Mengidentifikasi bangun ruang prisma.',
      },
      {
        no: '4.6.2',
        content: 'Menentukan bangun ruang limas.',
      },
      {
        no: '4.6.3',
        content: 'Menunjukan bangun ruang tabung.',
      },
      {
        no: '4.6.4',
        content: 'Menjelaskan bangun ruang kerucut.',
      },
      {
        no: '4.6.5',
        content: 'Menentukan bangun ruang bulat.',
      },
    ],
  },
  {
    title: 'Tujuan Pembelajaran',
    contents: [
      {
        no: '3.6.1',
        content: 'Memahami bangun ruang prisma.',
      },
      {
        no: '3.6.2',
        content: 'Mengetahui bangun ruang limas.',
      },
      {
        no: '3.6.3',
        content: 'Mengerti bangun ruang tabung.',
      },
      {
        no: '3.6.4',
        content: 'Memahami bangun ruang kerucut.',
      },
      {
        no: '3.6.5',
        content: 'Mengetahui bangun ruang bulat.',
      },
      {
        no: '4.6.1',
        content: 'Mengidentifikasi bangun ruang prisma.',
      },
      {
        no: '4.6.2',
        content: 'Menentukan bangun ruang limas.',
      },
      {
        no: '4.6.3',
        content: 'Menunjukan bangun ruang tabung.',
      },
      {
        no: '4.6.4',
        content: 'Menjelaskan bangun ruang kerucut.',
      },
      {
        no: '4.6.5',
        content: 'Menentukan bangun ruang bulat.',
      },
    ],
  }
];

export const KEYBOARD_LAYOUTS: { [key: string]: KeyboardLayoutObject } = {
  alphabetic: {
    default: [
      'q w e r t y u i o p',
      'a s d f g h j k l',
      'z x c v b n m {bksp}',
    ],
  },
  numeric: {
    default: [
      '1 2 3 4 5 {bksp}',
      '6 7 8 9 0 .',
    ],
  },
  formula: {
    default: [
      '1 2 3 4 5',
      '6 7 8 9 0',
      'π r t {bksp}',
      '+ - / × ² ³',

    ],
  },
};

export const SHAPE_PREVIEW_DEFAULT_HEIGHT = 272;