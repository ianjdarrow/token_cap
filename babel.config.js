module.exports = {
  presets: ['@babel/typescript', ['@babel/env', { loose: true }]],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]]
};
