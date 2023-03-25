import { MdOutlineHome, MdInfoOutline, MdOutlineLeaderboard, MdOutlinePersonOutline, MdHome, MdLeaderboard, MdPerson, MdInfo } from 'react-icons/md';
import { AiOutlineScan } from 'react-icons/ai'

// Types
import Shape from './types/Shape';
import MathSymbol from './types/MathSymbol';
import { KeyboardLayoutObject } from 'react-simple-keyboard';

// Shape descriptions is from mathway.com
export const SHAPES: Shape[] = [
  {
    name: 'Tabung',
    code: 'cylinder',
    description: 'Bangun tiga-dimensi yang mempunyai dua alas sejajar dan keduanya lingkaran yang kongruen.',
    vFormula: 'pi*r^2*t',

    // v2.x
    initiation: [
      { content: 'Pernahkah kamu bertanya-tanya, bagaimana sih menghitung volume benda tabung?' },
      { content: 'Jika kamu ingin tahu, kita dapat mempelajarinya!' },
      { content: 'Carilah benda tabung di sekitarmu seperti kaleng, toples, atau botol'},
      { content: 'Lalu, kita akan melakukan observasi dan mencari tahu bagaimana sih volume benda tersebut dihitung'},
    ],

    // stimulation: 'Jika memelihara ikan hias pastinya kita membutuhkan sebuah wadah untuk menampung ikan tersebut. Dan salah satu wadah yang mudah didapat dan bisa digunakan ialah toples.  ',
    // stimulationImage: '/images/cylinder-stimulation.jpeg',
    // problemIdentification: 'Cobalah amati toples yang kamu miliki yang sekiranya dapat digunakan sebagai wadah ikan hias. Lalu hitunglah volume air yang diperlukan untuk memenuhi toples tersebut.',
    // problemIdentificationImage: '/images/cylinder-stimulation.jpeg',
    // lpFormula: '2*pi*r*(r+t)',
    // nVertices: 0,
    // nEdges: 2,
    // nFaces: 3,
  },
  {
    name: 'Kerucut',
    code: 'cone',
    description: 'Bangun tiga-dimensi dengan alas lingkaran dan satu verteks.',
    vFormula: '1/3*pi*r^2*t',

    // v2.x
    initiation: [
      { content: 'Pernahkah kamu bertanya-tanya, bagaimana sih menghitung volume benda kerucut?' },
      { content: 'Jika kamu ingin tahu, kita dapat mempelajarinya!' },
      { content: 'Carilah benda kerucut di sekitarmu seperti topi ulang tahun, tutup saji, atau cone es krim'},
      { content: 'Lalu, kita akan melakukan observasi dan mencari tahu bagaimana sih volume benda tersebut dihitung'},
    ],

    // stimulation: 'Ut Consequat Semper Viverra Nam?',
    // stimulationImage: '/images/placeholder-image.jpeg',
    // problemIdentification: 'Aliquam Faucibus Purus in Massa?',
    // problemIdentificationImage: '/images/placeholder-image.jpeg',
    // lpFormula: 'pi*r*(r+s)',
    // nVertices: 1,
    // nEdges: 1,
    // nFaces: 2,
  },
  {
    name: 'Bola',
    code: 'sphere',
    description: 'Bangun tiga dimensi dengan semua titik dalam ruang berjarak tetap dari titik tertentu, yang disebut pusat.',
    vFormula: '4/3*pi*r^3',

    // v2.x
    initiation: [
      { content: 'Pernahkah kamu bertanya-tanya, bagaimana sih menghitung volume benda bola?' },
      { content: 'Jika kamu ingin tahu, kita dapat mempelajarinya!' },
      { content: 'Carilah benda bola di sekitarmu seperti bola sepak, kelereng, atau balon'},
      { content: 'Lalu, kita akan melakukan observasi dan mencari tahu bagaimana sih volume benda tersebut dihitung'},
    ],

    // stimulation: 'Ut Consequat Semper Viverra Nam?',
    // stimulationImage: '/images/placeholder-image.jpeg',
    // problemIdentification: 'Aliquam Faucibus Purus in Massa?',
    // problemIdentificationImage: '/images/placeholder-image.jpeg',
    // lpFormula: '4*pi*r^2',
    // nVertices: 0,
    // nEdges: 0,
    // nFaces: 1,
  },
  // {
  //   name: 'Prisma',
  //   code: 'prism',
  //   stimulation: 'Ut Consequat Semper Viverra Nam?',
  //   stimulationImage: '/images/placeholder-image.jpeg',
  //   problemIdentification: 'Aliquam Faucibus Purus in Massa?',
  //   problemIdentificationImage: '/images/placeholder-image.jpeg',
  //   description: 'Bangun geometri dengan dua alas yang kongruen, segi banyak yang sejajar, dan semua permukaannya merupakan jajaran genjang.',
  //   vFormula: 'la * t',
  //   lpFormula: '( 2 * la ) + ( ka * t )',
  //   nVertices: 'n × 2',
  //   nEdges: 'n × 3',
  //   nFaces: 'n + 2',
  // },
  // {
  //   name: 'Limas',
  //   code: 'pyramid',
  //   stimulation: 'Ut Consequat Semper Viverra Nam?',
  //   stimulationImage: '/images/placeholder-image.jpeg',
  //   problemIdentification: 'Aliquam Faucibus Purus in Massa?',
  //   problemIdentificationImage: '/images/placeholder-image.jpeg',
  //   description: 'Bangun tiga-dimensi yang mempunyai segi banyak sebagai alas dan semua sisinya segitiga dengan verteks yang saling bertemu.',
  //   vFormula: '( 1 / 3 ) * la * t',
  //   lpFormula: 'la + lst',
  //   nVertices: 'n + 1',
  //   nEdges: 'n × 2',
  //   nFaces: 'n + 1',
  // },
];

export const MATH_SYMBOLS: MathSymbol[] = [
  {
    symbol: 'π',
    code: 'pi',
    title: 'Pi',
  },
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
    defaultValue: 14,
  },
  {
    symbol: 't',
    code: 't',
    title: 'Tinggi',
    defaultValue: 20,
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
    href: '/introduction',
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