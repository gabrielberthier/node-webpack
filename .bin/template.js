const webpack = require("webpack");
const defaultConfig = require("../packer-config/webpack.config");
const path = require("path");
const fs = require("fs");

process.on("SIGINT", process.exit);

/**
 * @callback CompilerExecutor
 * @param { webpack.Compiler} serverCompiler
 * @param { Object } serverConfig
 * @returns {void}
 */

/**
 *
 * @param {string} environment
 * @param {CompilerExecutor} serverCompilerExecutor
 */
module.exports = (environment, serverCompilerExecutor) => {
  const configPath = path.resolve("backpack.config.js");
  let userConfig = {};

  const options = {
    env: environment,
  };

  if (fs.existsSync(configPath)) {
    const userConfigModule = require(configPath);
    userConfig = userConfigModule.default || userConfigModule;
  }

  const serverConfig = userConfig.webpack
    ? userConfig.webpack(defaultConfig(options), options, webpack)
    : defaultConfig(options);

  process.on("SIGINT", process.exit);

  const serverCompiler = webpack(serverConfig);

  serverCompilerExecutor(serverCompiler, serverConfig);
};
