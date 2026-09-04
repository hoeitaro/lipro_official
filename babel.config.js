module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: ">0.5% in JP, not IE 11, last 2 versions, not dead",
        modules: false, // Webpack に任せる
        bugfixes: true, // Babel の既知のバグ回避
      },
    ],
    "@babel/preset-typescript",
  ],
};
