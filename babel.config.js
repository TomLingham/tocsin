module.exports = {
  presets: [
    "@babel/preset-react",
    ["@babel/preset-env", { useBuiltIns: "usage", corejs: 3 }],
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    ["babel-plugin-styled-components", { pure: true }],
    [
      "babel-plugin-module-resolver",
      {
        alias: {
          "@tocsin/worker": "@tocsin/worker",
          "^@tocsin/(.+)": "@tocsin/\\1/src",
        },
        extensions: [".ts", ".js", ".jsx", ".tsx", ".json", ".mjs"],
      },
    ],
  ],
  env: {
    node: {
      presets: [["@babel/preset-env", { targets: { node: "current" } }]],
    },
    "node:modules": {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" }, modules: false }],
      ],
    },
  },
};
