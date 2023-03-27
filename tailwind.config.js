/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        'inherit': 'inherit',
      },
      height: {
        'inherit': 'inherit',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
      padding: {
        'space-for-keyboard': '263px',
        '21': '5.25rem',
      },
      borderWidth: {
        '3': '3px',
        '6': '6px',
        '12': '12px',
        '16': '16px',
      },
      colors: {
        'google': '#EA5843',
        'google-focus': '#e13219',
        'facebook': '#4267B2',
        'facebook-focus': '#34518d',
        // primary: {
        //   50: '#dbe8ff',
        // }
        'primary-100': '#dbe8ff',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      translate: {
        '4/10': '40%',
      }
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          'primary': '#5393FF',
          'primary-focus': '#2073FF',
          'primary-content': '#FFFFFF',
          'secondary': '#C8DFEC',
          'base-100': '#E9EDFE',
          'base-200': '#83B1FE',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
