import path from "path";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import sourcemaps from "rollup-plugin-sourcemaps";

const packages = ["worker", "common", "server"];
const extensions = [".ts", ".tsx", ".js", ".jsx"];

const createPlugins = (root) => [
  typescript({
    rootDir: path.join(root, "src"),
    declarationDir: path.join(root, "dist", "types"),
    declaration: true,
    include: path.join(root, "src", "**", "*.ts"),
  }),
  babel({ extensions, envName: "node", babelHelpers: "bundled" }),
  resolve({ extensions, preferBuiltins: true }),
  commonjs(),
  json(),
  sourcemaps(),
];

export default packages.map((pkg) => ({
  input: `packages/${pkg}/src/index.ts`,
  output: {
    dir: `packages/${pkg}/dist`,
    format: "commonjs",
    sourcemap: true,
  },
  plugins: createPlugins(`packages/${pkg}`),
}));
