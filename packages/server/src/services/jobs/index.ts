import http from "http";
import https from "https";
import fs from "fs/promises";

interface IJobResources {
  [namespace: string]: string;
}

interface IResolvedJobResources {
  [namespace: string]: string;
}

export async function resolveJobResources(
  resources: IJobResources
): Promise<IResolvedJobResources> {
  const resolvedResources: IResolvedJobResources = {};

  for await (const [namespace, script] of createResourceIterator(resources)) {
    resolvedResources[namespace] = script;
  }

  return resolvedResources;
}

export async function* createResourceIterator(resources: IJobResources) {
  for (const [namespace, url] of Object.entries(resources)) {
    yield [namespace, await getFromHttp(url)];
  }
}

/**
 * Load job definitions from the defined URL resource.
 *
 * This can be a local file, or if starting with a http or https protocol will
 * be loaded over the network.
 */
export async function getJobDefinitions(
  resource: string
): Promise<IJobResources> {
  const rawJobDefinitions = /^https?:\/\//.test(resource)
    ? await getFromHttp(resource)
    : await getFromFile(resource);

  const jobResources: IJobResources = JSON.parse(rawJobDefinitions);

  // Basic runtime validation of the data structure...
  if (typeof jobResources !== "object" || jobResources == null) {
    throw new Error("InvalidJobDefinitions");
  }

  for (const namespace in jobResources) {
    if (typeof jobResources[namespace] !== "string") {
      throw new Error("InvalidJobDefinitions");
    }
  }

  return jobResources;
}

/**
 * Load a file from a url.
 */
export async function getFromHttp(url: string): Promise<string> {
  const client = url.startsWith("https://") ? https : http;

  return new Promise((resolve, reject) => {
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(response.statusMessage));
      }

      let data = "";
      response.on("data", (chunk) => (data += chunk));
      response.on("close", () => resolve(data));
    });
  });
}

/**
 * Read a file from the local file system.
 */
export async function getFromFile(path: string): Promise<string> {
  return (await fs.readFile(path)).toString();
}
