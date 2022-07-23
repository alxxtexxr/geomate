import { MdOutlineHome, MdInfoOutline, MdOutlineLeaderboard, MdOutlinePersonOutline, MdHome, MdLeaderboard, MdPerson, MdInfo } from 'react-icons/md';
import { AiOutlineScan } from 'react-icons/ai'

// Types
import Shape from './types/Shape';
import MathSymbol from './types/MathSymbol';

export const SHAPES: Shape[] = [
  {
    id: 1,
    name: 'Bola',
    code: 'sphere',
    stimulation: 'Ut Consequat Semper Viverra Nam?',
    stimulationImage: '/images/placeholder-image.jpeg',
    problemIdentification: 'Aliquam Faucibus Purus in Massa?',
    problemIdentificationImage: '/images/placeholder-image.jpeg',
    description: 'Bola adalah objek geometri dalam ruang tiga dimensi yang merupakan permukaan dari bola, analog dengan objek melingkar dalam dua dimensi, yaitu "lingkaran" adalah batas dari "cakram".',
    vFormula: '( 4 / 3 ) * PI * r ^ 3',
    lpFormula: '4 * PI * r ^ 2',
    nVertices: 0,
    nEdges: 0,
    nFaces: 1,
  },
  {
    id: 2,
    name: 'Tabung',
    code: 'cylinder',
    stimulation: 'Ut Consequat Semper Viverra Nam?',
    stimulationImage: '/images/placeholder-image.jpeg',
    problemIdentification: 'Aliquam Faucibus Purus in Massa?',
    problemIdentificationImage: '/images/placeholder-image.jpeg',
    description: 'Tabung atau silinder adalah bangun ruang tiga dimensi yang dibentuk oleh dua buah lingkaran identik yang sejajar dan sebuah persegi panjang yang mengelilingi kedua lingkaran tersebut. Tabung memiliki 3 sisi dan 2 rusuk.',
    vFormula: 'PI * r ^ 2 * t',
    lpFormula: '2 * PI * r * ( r + t )',
    nVertices: 0,
    nEdges: 2,
    nFaces: 3,
  },
  {
    id: 3,
    name: 'Prisma',
    code: 'prism',
    stimulation: 'Ut Consequat Semper Viverra Nam?',
    stimulationImage: '/images/placeholder-image.jpeg',
    problemIdentification: 'Aliquam Faucibus Purus in Massa?',
    problemIdentificationImage: '/images/placeholder-image.jpeg',
    description: 'Dalam geometri, prisma adalah bangun ruang tiga dimensi yang dibatasi oleh alas dan tutup identik berbentuk segi-n dan sisi-sisi tegak berbentuk persegi atau persegi panjang. Dengan kata lain prisma adalah bangun ruang yang mempunyai penampang melintang yang selalu sama dalam bentuk dan ukuran. Prisma segi-n memiliki n + 2 sisi, 3n rusuk dan 2n titik sudut.',
    vFormula: 'la * t',
    lpFormula: '( 2 * la ) + ( ka * t )',
    nVertices: -1,
    nEdges: -1,
    nFaces: -1,
  },
  {
    id: 4,
    name: 'Kerucut',
    code: 'cone',
    stimulation: 'Ut Consequat Semper Viverra Nam?',
    stimulationImage: '/images/placeholder-image.jpeg',
    problemIdentification: 'Aliquam Faucibus Purus in Massa?',
    problemIdentificationImage: '/images/placeholder-image.jpeg',
    description: 'Dalam geometri, kerucut adalah sebuah limas istimewa yang beralas lingkaran. Kerucut memiliki 2 sisi, 1 rusuk, dan 1 titik sudut.',
    vFormula: '( 1 / 3 ) * PI * r ^ 2 * t',
    lpFormula: 'PI * r * ( r + s )',
    nVertices: 1,
    nEdges: 1,
    nFaces: 2,
  },
  {
    id: 5,
    name: 'Limas',
    code: 'pyramid',
    stimulation: 'Ut Consequat Semper Viverra Nam?',
    stimulationImage: '/images/placeholder-image.jpeg',
    problemIdentification: 'Aliquam Faucibus Purus in Massa?',
    problemIdentificationImage: '/images/placeholder-image.jpeg',
    description: 'Dalam geometri, limas adalah bangun ruang tiga dimensi yang dibatasi oleh alas berbentuk segi-n dan sisi-sisi tegak berbentuk segitiga. Limas memiliki n + 1 sisi, 2n rusuk dan n + 1 titik sudut.',
    vFormula: '( 1 / 3 ) * la * t',
    lpFormula: 'la + lst',
    nVertices: -1,
    nEdges: -1,
    nFaces: -1,
  },
];

export const MATH_SYMBOLS: MathSymbol[] = [
  {
    symbol: 'a△',
    code: 'baseA',
    title: 'Alas Segitiga',
  },
  {
    symbol: 't△',
    code: 'baseT',
    title: 'Tinggi Segitiga',
  },
  {
    symbol: 's□',
    code: 'baseS',
    title: 'Sisi Persegi',
  },
  {
    symbol: 'LA',
    code: 'la',
    title: 'Luas Alas',
  },
  {
    symbol: 'r',
    code: 'r',
    title: 'Radius',
  },
  {
    symbol: 't',
    code: 't',
    title: 'Tinggi',
  },
  {
    symbol: 's',
    code: 's',
    title: 'Garis Pelukis',
  },

  {
    symbol: 'LST',
    code: 'lst',
    title: 'Luas Sisi Tegak',
  },
  {
    symbol: 'KA',
    code: 'ka',
    title: 'Keliling Alas',
  },
  {
    symbol: 'V',
    code: 'v',
    title: 'Volume',
  },
  {
    symbol: 'LP',
    code: 'lp',
    title: 'Luas Permukaan',
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
    href: '/intro',
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

export const INTROS = [
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
        content: 'Membandingkan prisma, tabung, limas, kerucut, dan bola.',
      },
      {
        no: '4',
        content: 'Mengidentifikasi prisma, tabung,limas, kerucut, dan bola.',
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
        content: 'Mengetahui bangun ruang bola.',
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
        content: 'Menentukan bangun ruang bola.',
      },
    ],
  }
];

export const DEFAULT_SIZE = 20;
// export const DEFAULT_SIZE_DIVIDER = 15