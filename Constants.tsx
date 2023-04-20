import { MdOutlineHome, MdOutlineArticle, MdOutlineLeaderboard, MdOutlinePersonOutline, MdHome, MdLeaderboard, MdPerson, MdArticle } from 'react-icons/md';
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
    description: 'Tabung merupakan bangun ruang yang mempunyai dua alas sejajar dan berbentuk lingkaran yang saling kongruen.',
    vFormula: 'pi*r^2*t',
    vFormulaRounded: 'roundTo(roundTo(pi*r^2,2)*t,2)',
    vFormulaUndiscovered: 'V_{tabung} = Luas\\ Alas \\times t',
    vFormulaUndiscoveredMathSymbols: ['baseArea', 't'],
    vFormulaDiscovered: 'V_{tabung} = \\pi \\times r^2 \\times t',

    // v2.x
    introductionMessages: [
      {
        message: 'Pernahkah kamu berpikir bagaimana cara menentukan volume air dalam gelas?',
        reply: 'Iya, bagaimana caranya?',
      },
      {
        message: 'Jika kamu ingin tahu, kita dapat mempelajarinya bersama-sama!',
        reply: 'Yuk kita pelajari!',
      },
      {
        message: 'Pertama-tama carilah benda berbentuk tabung di sekitarmu seperti gelas, toples, atau kaleng',
        reply: 'Sudah',
      },
      {
        message: 'Langkah selanjutnya, kita akan melakukan observasi dan mencari tahu cara menghitung volume tabung',
        reply: 'Mulai!',
      },
    ],
  },
  {
    code: 'cone',
    name: SHAPE_NAME_MAP['cone'],
    description: 'Kerucut merupakan bangun ruang yang dibatasi oleh sebuah sisi lengkung dan sebuah sisi alas yang berbentuk lingkaran.',
    vFormula: '(pi*r^2*t)/(3)',
    vFormulaRounded: 'roundTo(roundTo(roundTo(pi*r^2,2)*t/3,2),2)',
    vFormulaUndiscovered: ['V_{kerucut} = \\dfrac{V_{tabung}}{3}', 'V_{kerucut} = \\dfrac{Luas\\ Lingkaran \\times t}{3}'],
    vFormulaUndiscoveredMathSymbols: ['baseArea', 't'],
    vFormulaDiscovered: 'V_{kerucut} = \\dfrac{\\pi \\times r^2 \\times t}{3}',

    // v2.x
    introductionMessages: [
      {
        message: 'Pernahkah kamu berpikir bagaimana cara menentukan volume nasi untuk membuat tumpeng yang berbentuk kerucut?',
        reply: 'Iya, bagaimana caranya?',
      },
      {
        message: 'Jika kamu ingin tahu, kita dapat mempelajarinya bersama-sama!',
        reply: 'Yuk kita pelajari!',
      },
      {
        message: 'Pertama-tama carilah benda berbentuk kerucut di sekitarmu seperti contong eskrim, tutup saji, atau topi ulang tahun',
        reply: 'Sudah',
      },
      {
        message: 'Langkah selanjutnya, kita akan melakukan observasi dan mencari tahu cara menghitung volume kerucut',
        reply: 'Mulai!',
      },
    ],
  },
  {
    code: 'sphere',
    name: SHAPE_NAME_MAP['sphere'],
    description: 'Bola merupakan bangun ruang yang dibentuk oleh titik-titik yang berjarak sama terhadap suatu titik pusat.',
    vFormula: '(4*pi*r^3)/(3)',
    vFormulaRounded: 'roundTo(4*roundTo(roundTo(pi*r^3,2)/3,2),2)',
    vFormulaUndiscovered: ['V_{bola} = 4 \\times V_{kerucut}', 'V_{bola} = 4 \\times \\dfrac{V_{tabung}}{3}', 'V_{bola} = 4 \\times \\dfrac{Luas\\ Lingkaran \\times r}{3}'],
    vFormulaUndiscoveredMathSymbols: ['baseArea', 'r'],
    vFormulaDiscovered: 'V_{bola} = \\dfrac{4 \\times \\pi \\times r^3}{3}',

    // v2.x
    introductionMessages: [
      {
        message: 'Pernahkah kamu berpikir bagaimana cara menentukan volume bola?',
        reply: 'Iya, bagaimana caranya?',
      },
      {
        message: 'Jika kamu ingin tahu, kita dapat mempelajarinya bersama-sama!',
        reply: 'Yuk kita pelajari!',
      },
      {
        message: 'Pertama-tama carilah benda berbentuk bola di sekitarmu seperti kelereng, bola, atau semangka',
        reply: 'Sudah',
      },
      {
        message: 'Langkah selanjutnya, kita akan melakukan observasi dan mencari tahu cara menghitung volume bola',
        reply: 'Mulai!',
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
    title: 'Jari-Jari',
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
    icon: (<MdOutlineArticle className="text-2xl" />),
    activeIcon: (<MdArticle className="text-2xl" />),
    title: 'Evaluasi',
    href: '/evaluations',
  },
  {
    icon: (<AiOutlineScan className="text-3xl" />),
    activeIcon: (<AiOutlineScan className="text-3xl" />),
    title: 'Scanner',
    href: '/scanner',
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
  alphabeticFormula: {
    default: [
      'π r t ² ³ {bksp}',
    ],
  },
};

export const SHAPE_PREVIEW_DEFAULT_HEIGHT = 272;