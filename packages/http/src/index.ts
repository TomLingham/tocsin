import http from "http";
import https from "https";
import { HttpsProxyAgent } from "https-proxy-agent";
import { parse } from "url";

interface IHttpResponse extends http.IncomingMessage {
  body: string;
}

/**
 * GET an HTTP endpoint.
 */
export async function get(url: string): Promise<IHttpResponse> {
  const request = createHttpClient(url);

  return new Promise((resolve, reject) => {
    const req = request({}, (response) => {
      let body = "";
      response.on("data", (chunk) => (body += chunk));
      response.on("close", () => resolve(Object.assign(response, { body })));
      response.on("error", reject);
    });

    req.on("error", reject);

    req.end();
  });
}

/**
 * POST Json data to an endpoint
 */
export async function post(
  url: string,
  data: string,
  opts: http.RequestOptions = {}
): Promise<IHttpResponse> {
  const request = createHttpClient(url);

  const options: http.RequestOptions = {
    ...opts,
    method: "POST",
    headers: {
      ...opts.headers,
      "content-length": data.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = request(options, (response) => {
      let body = "";
      response.on("data", (chunk) => (body += chunk));
      response.on("close", () => resolve(Object.assign(response, { body })));
      response.on("error", reject);
    });

    req.on("error", reject);

    req.write(data);
    req.end();
  });
}

type IHttpProtocol = "https:" | "http:";

function createHttpClient(url: string) {
  const endpoint = parse(url);
  const client = endpoint.protocol === "https:" ? https.request : http.request;
  const proxyUrl = getProxyUrl(
    endpoint.protocol as IHttpProtocol,
    endpoint.hostname ?? ""
  );

  if (proxyUrl != null) {
    const agent = new HttpsProxyAgent(proxyUrl);
    return (
      opts: https.RequestOptions = {},
      callback: (res: http.IncomingMessage) => void
    ) => client({ agent, ...opts, ...endpoint }, callback);
  }

  return (
    opts: http.RequestOptions = {},
    callback: (res: http.IncomingMessage) => void
  ) => client({ ...opts, ...endpoint }, callback);
}

function getProxyUrl(protocol: IHttpProtocol, host: string): string | null {
  const allProxyEnv = ["all_proxy", "ALL_PROXY"];
  const noProxyEnv = ["no_proxy", "NO_PROXY"];

  const proxyEnv =
    protocol === "https:"
      ? ["https_proxy", "HTTPS_PROXY", ...allProxyEnv]
      : ["http_proxy", "HTTP_PROXY", ...allProxyEnv];

  const proxyUrl = proxyEnv.find(isInEnvironment);
  const noProxy = normalizeNoProxy(noProxyEnv.find(isInEnvironment) ?? "");

  if (proxyUrl == null || !noProxy.some((part) => host.endsWith(part))) {
    // if the proxy url isn't set, or the host appears in the no proxy variable
    // we just return null. We shouldn't try and use the proxy in this case.
    return null;
  }

  return proxyUrl;
}

function normalizeNoProxy(noProxy: string) {
  // TODO: No support for wildcards in no_proxy at the moment...
  return noProxy.split(",").map((host) => host.trim());
}

function isInEnvironment(variableName: string) {
  return variableName in process.env;
}