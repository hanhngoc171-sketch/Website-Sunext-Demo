/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./site/**/*.html",
    "./site/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
