import vm from "vm";
import m from "module";
import * as http from "@tocsin/http";

import * as tocsin from "./tocsin";

// Setting up the global namespace
global.tocsin = tocsin;

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
