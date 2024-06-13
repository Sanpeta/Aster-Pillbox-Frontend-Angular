/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,ts}"],
	theme: {
		extend: {
			colors: {
				dark: "#212121",
				light: "#ffffff",
				sidenavColor: "#212121",
				sidenavTextColor: "#ffffff",
				toolbarColor: "#212121",
				toolbarTextColor: "#ffffff",
				textColor: "#ffffff",
			},
		},
	},
	plugins: [],
};
