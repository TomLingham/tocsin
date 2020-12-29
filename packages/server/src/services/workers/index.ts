import vm from "vm";
import m from "module";
import { http } from "@tocsin/common";
import { monitor } from "./monitor";

// @ts-ignore
global.monitor = monitor;

const [, , url] = process.argv;

http
  .get(url)
  .then((res) =>
    vm.runInThisContext(m.wrap(res.body))(
      exports,
      require,
      module,
      __filename,
      __dirname
    )
  );
