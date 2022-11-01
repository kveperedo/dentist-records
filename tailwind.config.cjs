/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	important: '#app',
	theme: {
		fontFamily: {
			poppins: ['Poppins', 'sans-serif'],
		},
		extend: {
			animation: {
				'fade-in': 'fade-in 0.25s',
				'fade-out': 'fade-out 0.25s',
			},
			keyframes: {
				'fade-in': {
					'0%': {
						opacity: 0,
					},
					'100%': {
						opacity: 1,
					},
				},
				'fade-out': {
					'0%': {
						opacity: 1,
					},
					'100%': {
						opacity: 0,
					},
				},
			},
			colors: {
				primary: {
					50: '#f4f9f7',
					100: '#dbece5',
					200: '#b7d8cc',
					300: '#8bbdac',
					400: '#629f8c',
					500: '#417667',
					600: '#38695c',
					700: '#30554c',
					800: '#2a453f',
					900: '#263b36',
				},
			},
		},
	},
};
