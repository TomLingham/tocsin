const https = jest.createMockFromModule<typeof import("https")>("https");

let data: string = "";

https.get = function get(_url: any, callback: any): any {
  callback({
    on: jest.fn((_event: string, handler: Function) => handler(data)),
    statusCode: 200,
  });
};

const __mock = {
  setData: (d: string) => (data = d),
};

declare module "https" {
  var __https_mock: typeof __mock;
}

export default https;
export { __mock as __https_mock };
