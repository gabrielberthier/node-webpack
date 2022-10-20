# node-webpack

This repository is a boilerplate to initiate a Node.js project using most of ECMA's new features which are - mostly - unsupported by current Node's environment. It is highly influenced by [Backpack](https://github.com/jaredpalmer/backpack), a very useful minimalistic build system for Node.js.

However, having used Backpack I noticed some of the tool's libs were outdated and many of the configurations were about to be discontinued in next releases of the main libs of Backpack ([Babel](https://babeljs.io/docs/en/babel-polyfill#usage-in-node--browserify--webpack) and [Webpack](https://webpack.js.org/api/node/)).

Using Webpack and Babel is not an easy task at the beginning - the two of them altogether is even harder. Since both of these packages come with a large set of options and are plentiful of minor configurations, it's a little complex to start from either documentation. Thankfully, using Backpack as a guide, I was able to leverage the source code, migrate those package's to their latest versions and tried my best to simplify their API's using their current syntax. In that manner, I believe it is easier to start a project using ESM and ECMA's new features by default now, being necessary just to build the source code using `npm exec pack` for a quickstart in development mode or go for production mode by using `npm exec pack build`.

This project aims to simplify building process in a scaffold template using default options.

The final result is bundled in CommonJS, as it is **_currently_** more compatible with Node.js's current versions.

## How to use

The easiest way is by including a script section as below:
and add a script to your package.json like this:

```json
{
  "scripts": {
    "dev": "node ./.bin/packer",
    "build": "node ./.bin/packer build"
  }
}
```

## CLI Commands

### `npm exec pack dev`

Runs in development mode, watching for file changes.

### `npm exec pack build`

Runs in product mode, generating a bundled app.

## How does it work?

### .bin

- Within .bin directory there are some files accountable to bundle the source code, i.e, _build_ and _dev_. Those files are called in a subprocess managed by the entry file packer. Once called, the packer file will handle the CLI request and invoke any of the files responsible for building the bundle.

### packer-config

- babel-default-preset.js
  - manages some of Babel's plugins and presets in order to polyfill some of ECMA's features and transpile the source code from ESM into CommonJS modules.
  - polyfills behaviours in test scenarios.
- paths.js
  - includes directives to paths required for Webpack and Babel to work.
- webpack.config.js
  - accountable to bundle and load dependencies within the source code files.
  - loads files and transforms them by using babel-loader.
