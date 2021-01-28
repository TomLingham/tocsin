import path from "path";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import fg from "fast-glob";
import { terser } from "rollup-plugin-terser";
import { writeFile } from "fs/promises";

const jobs = fg.sync("./src/**/*.job.ts");
const extensions = [".ts", ".tsx", ".js", ".jsx"];

const plugins = [
  babel({ extensions, envName: "node", babelHelpers: "bundled" }),
  terser(),
  resolve({ extensions, preferBuiltins: true }),
  commonjs(),
  json(),
];

export default jobs.map((job) => ({
  input: job,
  output: {
    file: job.replace("./src", "./dist").replace(".job.ts", ".job.js"),
    format: "commonjs",
  },
  plugins: plugins.concat({
    writeBundle: () => {
      const jobMeta = jobs.map(toNamespace).reduce((meta, ns) => {
        meta[ns] = `http://localhost:8000/${toPath(ns)}.job.js`;
        return meta;
      }, {});

      const metaPath = path.resolve("dist", "jobs.json");
      writeFile(metaPath, JSON.stringify(jobMeta, null, 2));
    },
  }),
}));

function toNamespace(p) {
  return p
    .replace(/^\.\/src\//, "")
    .replace(/\.job\.ts$/, "")
    .replaceAll("/", ":");
}

function toPath(p) {
  return p.replaceAll(":", "/");
}
