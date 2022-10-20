const webpack = require("webpack");
const defaultConfig = require("../packer-config/webpack.config");
const path = require("path");
const fs = require("fs");

process.on("SIGINT", process.exit);

function startServerCompilerDevMode(serverCompiler) {
  const nodemon = require("nodemon");
  const once = require("ramda").once;

  const startServer = () => {
    const serverPaths = Object.keys(serverCompiler.options.entry).map((entry) =>
      path.join(serverCompiler.options.output.path, `${entry}.js`)
    );
    nodemon({
      script: serverPaths[0],
      watch: serverPaths,
      nodeArgs: process.argv.slice(2),
    }).on("quit", process.exit);
  };

  const startServerOnce = once((err, stats) => {
    if (err) return;
    startServer();
  });
  serverCompiler.watch(serverConfig.watchOptions || {}, startServerOnce);
}

function startServerCompilerProdMode(serverCompiler) {
  serverCompiler.run((error, stats) => {
    if (error || stats.hasErrors()) {
      process.exitCode = 1;
    }
  });
}

function startServerCompiler(env, serverCompiler) {
  const executor =
    env === "development"
      ? startServerCompilerDevMode
      : startServerCompilerProdMode;
  executor(serverCompiler);
}

module.exports = (environment = "dev") => {
  if (environment === "dev") {
    environment = "development";
  }
  const env = environment || process.env.NODE_ENV || "production";
  const options = {
    env,
  };

  console.log(options);

  const configPath = path.resolve("backpack.config.js");
  let userConfig = {};

  if (fs.existsSync(configPath)) {
    const userConfigModule = require(configPath);
    userConfig = userConfigModule.default || userConfigModule;
  }

  const serverConfig = userConfig.webpack
    ? userConfig.webpack(defaultConfig(options), options, webpack)
    : defaultConfig(options);

  process.on("SIGINT", process.exit);

  const serverCompiler = webpack(serverConfig);

  startServerCompiler(environment, serverCompiler);
};
