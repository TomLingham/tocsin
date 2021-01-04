import http from "http";
import { parse } from "url";
import https from "https";
import { HttpsProxyAgent } from "https-proxy-agent";

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
  const httpEnv = ["http_proxy", "HTTP_PROXY"];
  const httpsEnv = ["https_proxy", "HTTPS_PROXY"];
  const env = protocol === "https:" ? httpsEnv : httpEnv;
  const proxyUrl = env.find((n) => n in process.env);
  const noProxy = normalizeNoProxy(
    process.env.no_proxy ?? process.env.NO_PROXY ?? ""
  );

  if (proxyUrl == null || !noProxy.some((part) => host.endsWith(part))) {
    return null;
  }

  return proxyUrl;
}

function normalizeNoProxy(noProxy: string) {
  // TODO: No support for wildcards in no_proxy at the moment...
  return noProxy.split(",").map((host) => host.trim());
}
