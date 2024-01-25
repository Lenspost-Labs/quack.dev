import Web3 from "web3";
import prisma from "../clients/prisma";
import { createCipheriv, createDecipheriv } from "crypto";

export const getOrCreatePublicKey = async (userId: string) => {
  let auth = await prisma.auth.findUnique({
    where: {
      userId: userId,
    },
    select: {
      public_address: true,
    },
  });

  if (!auth) {
    const web3 = new Web3(process.env.OP_RPC_URL);

    console.log("Creating new keypair...");

    const account = web3.eth.accounts.create();

    console.log("Keypair created!");

    const encryption_secret = process.env.ENCRYPTION_KEY as string;
    const iv = process.env.IV as string;

    const cipher = createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryption_secret, "hex"),
      Buffer.from(iv, "hex")
    );

    console.log("Encrypting keypair...");

    const encrypted_secret =
      cipher.update(account.privateKey, "utf8", "hex") + cipher.final("hex");

    console.log("Keypair encrypted!");

    function decrypt(encryptedText: string) {
      const decipher = createDecipheriv(
        "aes-256-cbc",
        Buffer.from(encryption_secret, "hex"),
        Buffer.from(iv, "hex")
      );
      let decrypted = decipher.update(encryptedText, "hex", "utf-8");
      decrypted += decipher.final("utf-8");
      console.log(decrypted);
      return decrypted;
    }

    await prisma.auth.create({
      data: {
        userId: userId,
        public_address: account.address,
        secret_key: encrypted_secret,
      },
    });

    return account.address;
  } else {
    return auth.public_address;
  }
};
