module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'google': '#EA5843',
        'google-focus': '#e13219',
        'facebook': '#4267B2',
        'facebook-focus': '#34518d',
      }
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          // 'primary': '#83B1FE',
          'primary': '#5393FF',
          'primary-focus': '#2073FF',
          'primary-content': '#FFFFFF',
          'base-100': '#E9EDFE',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
