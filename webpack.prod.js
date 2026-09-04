// webpack.prod.js
import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";
import TerserPlugin from "terser-webpack-plugin";

export default merge(commonConfig, {
  mode: "production",

  optimization: {
    // ツリーシェイキング有効化
    usedExports: true,

    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true, // console.logなどを削除
          },
        },
      }),
    ],
  },
});
