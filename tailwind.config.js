/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: [
            {
                light: {
                    ...require('daisyui/src/colors/themes')[
                        '[data-theme=light]'
                    ],
                    primary: '#2563eb',
                },
            },
            {
                dark: {
                    ...require('daisyui/src/colors/themes')[
                        '[data-theme=dark]'
                    ],
                    primary: '#2563eb',
                },
            },
        ],
    },
    plugins: [require('daisyui')],
}
