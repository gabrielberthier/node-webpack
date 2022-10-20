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
    mainBabelOptions.presets.push(require.resolve("../babel"));
  }

  return {
    mode: options.env === "development" ? "development" : "production",
    target: "node",
    devtool: "source-map",
    externals: [
      nodeExternals({
        modulesFromFile: true,
        whitelist: [
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
        // Process JS with Babel (transpiles ES6 code into ES5 code).
        {
          test: /\.(js|jsx)$/,
          loader: require.resolve("babel-loader"),
          exclude: [/node_modules/, config.buildPath],
          options: mainBabelOptions,
        },
      ],
    },
    // A few commonly used plugins have been removed from Webpack v4.
    // Now instead, these plugins are avaliable as "optimizations".
    // @see https://webpack.js.org/configuration/optimization/
    optimization: {
      noEmitOnErrors: true,
    },
    plugins: [
      // We define some sensible Webpack flags. One for the Node environment,
      // and one for dev / production. These become global variables. Note if
      // you use something like eslint or standard in your editor, you will
      // want to configure __DEV__ as a global variable accordingly.
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(options.env),
        __DEV__: options.env === "development",
      }),
      // In order to provide sourcemaps, we automagically insert this at the
      // top of each file using the BannerPlugin.
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
      // The FriendlyErrorsWebpackPlugin (when combined with source-maps)
      // gives Backpack its human-readable error messages.
      new FriendlyErrorsWebpackPlugin({
        clearConsole: options.env === "development",
      }),
    ],
  };
};
