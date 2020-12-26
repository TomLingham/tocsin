const http = jest.createMockFromModule<typeof import("http")>("http");

let data: string = "";

http.get = function get(_url: any, callback: any): any {
  setTimeout(callback, 200, {
    on: jest.fn((_event: string, handler: Function) => handler(data)),
    statusCode: 200,
  });
};

const __mock = {
  setData: (d: string) => (data = d),
};

declare module "http" {
  var __http_mock: typeof __mock;
}

export default http;
export { __mock as __http_mock };
