import Web3 from "web3";
import prisma from "../clients/prisma";
import { createCipheriv } from "crypto";

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
    const web3 = new Web3();

    const account = web3.eth.accounts.create();

    const encryption_secret = process.env.ENCRYPTION_KEY as string;
    const iv = process.env.IV as string;

    const cipher = createCipheriv("aes-256-cbc", encryption_secret, iv);

    const encrypted_secret =
      cipher.update(account.privateKey, "utf8", "hex") + cipher.final("hex");

    // function decrypt(encryptedText: string) {
    //     const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), Buffer.from(iv));
    //     let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    //     decrypted += decipher.final('utf-8');
    //     return decrypted;
    //   }

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
