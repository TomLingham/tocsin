import crypto from "crypto";

export function randomId() {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Run callback (callbackfn) over the selected keys.
 * @param obj The object with which to operate over the selected keys
 * @param keys The keys with witch to operate over.
 */
export function forKeys<
  T extends object,
  S extends Array<keyof T>,
  Q extends any
>(obj: T, keys: S) {
  type RT = Q extends (v: T[S[any]], key: string) => infer R ? R : any;

  type OKeys = Omit<T, typeof keys[any]>;
  type PKeys = Pick<T, typeof keys[any]>;

  return <U extends RT>(callbackfn: U) => {
    for (const key of keys) {
      obj[key] = callbackfn(obj[key], key);
    }
    return obj as OKeys & { [keys in keyof PKeys]: ReturnType<U> };
  };
}
