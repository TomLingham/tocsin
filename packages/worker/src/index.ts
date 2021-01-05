import vm from "vm";
import m from "module";
import * as http from "@tocsin/http";
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
