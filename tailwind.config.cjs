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
		},
	},
	plugins: [
		require('tailwindcss-radix')({
			variantPrefix: 'rdx',
		}),
	],
};
