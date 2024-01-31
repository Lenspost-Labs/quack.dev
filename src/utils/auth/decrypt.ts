import { createDecipheriv } from "crypto";
const encryption_secret = process.env.ENCRYPTION_KEY as string;
const iv = process.env.IV as string;

export function decrypt(encryptedText: string) {
  const decipher = createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryption_secret, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
