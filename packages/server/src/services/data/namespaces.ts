import { TocsinWorker } from "../jobs/namespace";

const Namespaces = new Set();

export function add(namespace: TocsinWorker) {
  Namespaces.add(namespace);
}
