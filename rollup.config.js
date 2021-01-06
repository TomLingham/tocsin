import path from "path";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import sourcemaps from "rollup-plugin-sourcemaps";
import alias from "@rollup/plugin-alias";

const packages = ["core", "http", "worker", "server"];
const extensions = [".ts", ".tsx", ".js", ".jsx"];

const createPlugins = (root) => [
  alias({
    entries: [
      { find: /^@tocsin\/(.+)\/dist\/(.+)/, replacement: "@tocsin/$1/src/$2" },
    ],
  }),
  babel({
    extensions,
    envName: "node",
    babelHelpers: "bundled",
  }),
  resolve({ extensions, preferBuiltins: true }),
  commonjs(),
  json(),
  sourcemaps(),
];

export default packages.flatMap((pkg) => {
  const root = `packages/${pkg}`;
  const plugins = createPlugins(root);
  return [
    {
      input: `${root}/src/index.ts`,
      output: [
        {
          dir: `${root}/dist`,
          format: "commonjs",
          sourcemap: true,
        },
      ],
      plugins,
    },
    {
      input: `${root}/src/index.ts`,
      output: [
        {
          dir: `${root}/module`,
          format: "module",
          sourcemap: true,
        },
      ],
      plugins: plugins.concat(
        typescript({
          rootDir: path.join(root, "src"),
          declarationDir: path.join(root, "module", "types"),
          declaration: true,
          include: [path.join(root, "src", "**", "*.ts")],
          exclude: ["**/__test__/**"],
        })
      ),
    },
  ];
});
