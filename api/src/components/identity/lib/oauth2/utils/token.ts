import crypto from "crypto";

export function generateRandomToken(len = 10) {
  return crypto.randomBytes(len).toString("hex");
}
