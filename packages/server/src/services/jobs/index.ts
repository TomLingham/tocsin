import fs from "fs/promises";
import * as http from "@tocsin/http";

/**
 * Load job definitions from the defined URL resource.
 *
 * This can be a local file, or if starting with a http or https protocol will
 * be loaded over the network.
 */
export async function getJobDefinitions<T = Record<string, string>>(
  resource: string
): Promise<T> {
  const rawJobDefinitions = /^https?:\/\//.test(resource)
    ? await http.get(resource).then((res) => res.body)
    : (await fs.readFile(resource)).toString();

  const jobResources: T = JSON.parse(rawJobDefinitions);

  // TODO: Better schema validation
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
