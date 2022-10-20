module.exports = function () {
  const path = require("path");

  const preset = {
    presets: [
      [
        require.resolve("@babel/preset-env"),
        {
          targets: {
            node: "current",
          },
          modules: false,
          useBuiltIns: "usage",
          corejs: {
            version: "3.8",
            proposals: true,
          },
        },
      ],
    ],
    plugins: [
      require.resolve("@babel/plugin-proposal-class-properties"),
      [
        require.resolve("@babel/plugin-proposal-object-rest-spread"),
        {
          useBuiltIns: true,
        },
      ],
      [
        require.resolve("@babel/plugin-transform-regenerator"),
        {
          async: false,
        },
      ],
      [
        require.resolve("@babel/plugin-transform-runtime"),
        {
          helpers: false,
          regenerator: true,
          absoluteRuntime: path.dirname(
            require.resolve("@babel/runtime/package")
          ),
        },
      ],
    ],
  };

  const v = process.versions.node.split(".");
  if ((v[0] >= 7 && v[1] >= 6) || v[0] >= 8) {
    preset.presets[0].exclude = [
      "@babel/plugin-transform-regenerator",
      "@babel/transform-async-to-generator",
    ];
  }
  if (process.env.NODE_ENV === "test" || process.env.BABEL_ENV === "test") {
    preset.plugins.push.apply(preset.plugins, [
      require.resolve("@babel/plugin-transform-parameters"),
      [
        require.resolve("@babel/plugin-transform-modules-commonjs"),
        { loose: true },
      ],
    ]);
  }

  return preset;
};
