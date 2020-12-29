import http from "http";
import { parse } from "url";
import https from "https";
import { HttpsProxyAgent } from "https-proxy-agent";

interface IHttpResponse extends http.IncomingMessage {
  body: string;
}

const proxyEnvVariables = ["http_proxy", "https_proxy", "no_proxy"];

interface IProxyConf {
  httpProxy?: string;
  httpsProxy?: string;
  noProxy: string[];
}

/**
 * GET an HTTP endpoint.
 */
export async function get(url: string): Promise<IHttpResponse> {
  const request = getClient(url);

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
export async function post(url: string, data: object): Promise<IHttpResponse> {
  const request = getClient(url);
  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "content-length": jsonData.length,
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

    req.write(jsonData);
    req.end();
  });
}

function getClient(url: string) {
  const endpoint = parse(url);
  const client = endpoint.protocol === "https:" ? https.request : http.request;

  if (process.env.HTTP_PROXY) {
    const noProxyHosts = process.env.NO_PROXY?.split(",").map((v) => v.trim());
    if (!noProxyHosts?.some((v) => endpoint.host?.endsWith(v))) {
      const agent = new HttpsProxyAgent(process.env.HTTP_PROXY ?? "");
      console.log(
        "Using proxy for request",
        url,
        process.env.HTTP_PROXY,
        endpoint
      );

      return (
        opts: https.RequestOptions = {},
        callback: (res: http.IncomingMessage) => void
      ) =>
        client(
          {
            agent,
            ...endpoint,
            ...opts,
          },
          callback
        );
    }
  }
  console.log("NOT Using proxy for request", url, endpoint);
  return (
    opts: http.RequestOptions = {},
    callback: (res: http.IncomingMessage) => void
  ) => client({ ...endpoint, ...opts }, callback);
}

function getProxyConfig(): IProxyConf | null {
  return {
    httpProxy: process.env.http_proxy ?? process.env.HTTP_PROXY,
    httpsProxy: process.env.https_proxy ?? process.env.HTTPS_PROXY,
    noProxy: normalizeNoProxy(process.env.NO_PROXY ?? ""),
  };
}

function normalizeNoProxy(noProxy: string) {
  // TODO: No support for wildcards at the moment.
  return noProxy.split(",").map((host) => host.trim());
}
