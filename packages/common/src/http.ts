import http from "http";
import https from "https";

interface IHttpResponse extends http.IncomingMessage {
  body: string;
}

/**
 * Load a file from a url.
 */
export async function get(url: string): Promise<IHttpResponse> {
  const client = url.startsWith("https://") ? https : http;

  return new Promise((resolve, reject) => {
    try {
      const request = client.request(url, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error(response.statusMessage));
        }

        let body = "";
        response.on("data", (chunk) => (body += chunk));
        response.on("close", () => resolve(Object.assign(response, { body })));
        response.on("error", reject);
      });

      request.on("error", reject);
      request.end();
    } catch (error) {
      console.log("TC", error);
    }
  });
}
