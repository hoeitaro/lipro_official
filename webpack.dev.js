import path from "path";
import { fileURLToPath } from "url";
import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";

// 現在のファイルの絶対パス
const __filename = fileURLToPath(import.meta.url);
// 現在のディレクトリのパス
const __dirname = path.dirname(__filename);

export default merge(commonConfig, {
  mode: "development",
  devtool: "source-map",

  devServer: {
    static: {
      directory: path.resolve(__dirname, "src"),
    },
    hot: true,
    open: true,
  },

  watch: true,
  // WSL2 (Linux) 対応用: watch が機能しない場合は poll オプションを有効化
  // watchOptions: {
  //   poll: true,
  // },
});
