const path = require("path");

require("@babel/register")({
  cwd: path.resolve(__dirname, ".."),
  extensions: [".js", ".jsx", ".ts", ".tsx"],
});
