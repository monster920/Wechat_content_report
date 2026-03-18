/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1890FF',
        success: '#52C41A',
        warning: '#FAAD14',
        error: '#F5222D',
        title: '#262626',
        text: '#595959',
        auxiliary: '#8C8C8C',
        border: '#E8E8E8',
      },
      fontSize: {
        'report-title': '18px',
        'dimension-title': '16px',
        'sub-title': '14px',
        'body': '14px',
        'auxiliary': '12px',
      },
      spacing: {
        'card-padding': '16px',
        'card-gap': '24px',
        'section-gap': '32px',
        'page-margin': '24px',
      },
    },
  },
  plugins: [],
}