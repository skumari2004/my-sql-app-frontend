// postcss.config.cjs
// This file is renamed to .cjs because your package.json has "type": "module".

module.exports = {
  plugins: {
    // Use the new @tailwindcss/postcss plugin
    '@tailwindcss/postcss': {}, // Updated to use the new package
    autoprefixer: {},
  },
};
