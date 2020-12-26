const fs = jest.createMockFromModule<typeof import("fs/promises")>(
  "fs/promises"
);

let data: any = Buffer.from("");

fs.readFile = async (_path: any, _options: any) => data;

const __mock = {
  setData: (d: Buffer) => (data = d),
};

declare module "fs/promises" {
  var __fs_mock: typeof __mock;
}

export default fs;
export { __mock as __fs_mock };
