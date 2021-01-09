import crypto from "crypto";

export function randomId() {
  return crypto.randomBytes(16).toString("hex");
}
