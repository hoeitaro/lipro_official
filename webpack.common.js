import path from "path";
import { fileURLToPath } from "url";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import autoprefixer from "autoprefixer";
import CopyPlugin from "copy-webpack-plugin";
import { htmlWebpackPluginTemplateCustomizer } from "template-ejs-loader";
import WebpackWatchedGlobEntries from "webpack-watched-glob-entries-plugin";

// 現在のファイルの絶対パス
const __filename = fileURLToPath(import.meta.url);
// 現在のディレクトリのパス
const __dirname = path.dirname(__filename);

const filePath = {
  js: "./src/js/",
  ejs: "./src/ejs/",
  sass: "./src/scss/",
};

const entriesJs = getJsEntries();
const entriesEjs = getEjsEntries();

// console.log(entriesJs);
// console.log(entriesEjs);

export default {
  entry: entriesJs,
  output: {
    filename: "js/[name].[hash].js",
    path: path.resolve(__dirname, "dist/assets"),
    chunkFilename: "js/[name].[hash].js",
    publicPath: "/assets/",
    clean: true,
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })],
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      minChunks: 2,
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: "vendor",
          enforce: true,
          priority: 10,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.ejs$/i,
        use: ["html-loader", "template-ejs-loader"],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(sass|scss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false, importLoaders: 2 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: { plugins: [autoprefixer({ grid: true })] },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  resolve: { extensions: [".ts", ".js"] },
  target: "web",
  plugins: [
    ...generateHtmlPlugins(entriesEjs),
    new MiniCssExtractPlugin({ filename: "css/[name].[hash].css" }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/images/"),
          to: path.resolve(__dirname, "dist/assets/images"),
        },
        {
          from: path.resolve(__dirname, "src/manifest.webmanifest/"),
          to: path.resolve(__dirname, "dist/assets/manifest.webmanifest"),
        },
        {
          from: path.resolve(__dirname, "src/images/favicons/favicon.ico/"),
          to: path.resolve(__dirname, "dist/favicon.ico"),
        },
        {
          from: path.resolve(__dirname, "src/images/favicons/icon.svg/"),
          to: path.resolve(__dirname, "dist/icon.svg"),
        },
      ],
    }),
  ],
  watchOptions: { ignored: /node_modules/ },
};

// =========================
// 関数
// =========================

// function getJsEntries() {
//   return WebpackWatchedGlobEntries.getEntries([path.resolve(__dirname, `${filePath.js}/**/*.{js,ts}`)], {
//     ignore: path.resolve(__dirname, `${filePath.js}**/_*.{js,ts}`),
//   })();
// }

// function getEjsEntries() {
//   return WebpackWatchedGlobEntries.getEntries([path.resolve(__dirname, `${filePath.ejs}**/*.ejs`)], {
//     ignore: path.resolve(__dirname, `${filePath.ejs}**/_*.ejs`),
//   })();
// }

function getJsEntries() {
  const entries = WebpackWatchedGlobEntries.getEntries([`${filePath.js}**/*.{js,ts}`], {
    ignore: `${filePath.js}**/_*.{js,ts}`,
  })();

  // './' を付けて相対パスに変換
  const fixedEntries = {};
  for (const key in entries) {
    fixedEntries[key] = `./${entries[key].replace(/\\/g, "/")}`; // Windows 対応で \ を /
  }

  return fixedEntries;
}

function getEjsEntries() {
  const entries = WebpackWatchedGlobEntries.getEntries([`${filePath.ejs}**/*.ejs`], {
    ignore: `${filePath.ejs}**/_*.ejs`,
  })();

  // Windows 対応で './' を付ける
  const fixedEntries = {};
  for (const key in entries) {
    fixedEntries[key] = `./${entries[key].replace(/\\/g, "/")}`;
    // console.log(fixedEntries[key]);
  }

  return fixedEntries;
}

function generateHtmlPlugins(entries) {
  // console.log(entries);
  const chunksMap = {
    index: ["top"],
    thanks: ["top"],
    default: ["main"],
  };

  return Object.keys(entries).map((key) => {
    const chunks = chunksMap[key] || chunksMap.default;
    return new HtmlWebpackPlugin({
      filename: `../${key}.html`,
      template: htmlWebpackPluginTemplateCustomizer({
        htmlLoaderOption: {
          sources: false,
          minimize: false,
        },
        templatePath: `${filePath.ejs}${key}.ejs`,
      }),
      chunks,
      inject: "body",
      scriptLoading: "defer",
    });
  });
}
