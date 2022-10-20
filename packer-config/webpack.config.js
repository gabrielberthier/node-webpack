const fs = require("fs");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const config = require("./paths");
const path = require("path");

module.exports = (options) => {
  const babelRcPath = path.resolve(".babelrc");
  const hasBabelRc = fs.existsSync(babelRcPath);
  const mainBabelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [],
  };

  if (hasBabelRc) {
    console.log("> Using .babelrc defined in your app root");
  } else {
    mainBabelOptions.presets.push(require.resolve("./babel-default-preset"));
  }

  return {
    mode: options.env === "development" ? "development" : "production",
    target: "node",
    devtool: "source-map",
    externals: [
      nodeExternals({
        modulesFromFile: true,
        allowlist: [
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|less|styl)$/,
        ],
      }),
    ],
    performance: {
      hints: false,
    },
    resolve: {
      extensions: [".js", ".json"],
    },
    resolveLoader: {},
    node: {
      __filename: true,
      __dirname: true,
    },
    entry: {
      main: [`${config.serverSrcPath}/index.js`],
    },
    output: {
      path: config.serverBuildPath,
      filename: "[name].js",
      sourceMapFilename: "[name].map",
      publicPath: config.publicPath,
      libraryTarget: "commonjs2",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: require.resolve("babel-loader"),
          exclude: [/node_modules/, config.buildPath],
          options: mainBabelOptions,
        },
      ],
    },
    optimization: {
      emitOnErrors: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(options.env),
        __DEV__: options.env === "development",
      }),
      new webpack.BannerPlugin({
        raw: true,
        entryOnly: false,
        banner: `require('${
          // Is source-map-support installed as project dependency, or linked?
          require.resolve("source-map-support").indexOf(process.cwd()) === 0
            ? // If it's resolvable from the project root, it's a project dependency.
              "source-map-support/register"
            : // It's not under the project, it's linked via lerna.
              require.resolve("source-map-support/register")
        }');`,
      }),

      new FriendlyErrorsWebpackPlugin({
        clearConsole: options.env === "development",
      }),
    ],
  };
};
