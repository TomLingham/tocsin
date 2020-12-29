import http from "http";
import { URL } from "url";
import https from "https";

interface IHttpResponse extends http.IncomingMessage {
  body: string;
}

/**
 * GET an HTTP endpoint.
 */
export async function get(url: string): Promise<IHttpResponse> {
  const request = getClient(url);

  return new Promise((resolve, reject) => {
    const req = request(url, (response) => {
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
    const req = request(url, options, (response) => {
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
  const { protocol } = new URL(url);
  return protocol === "https:" ? https.request : http.request;
}
