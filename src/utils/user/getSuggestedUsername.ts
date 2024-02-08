import { TldParser } from "@onsol/tldparser";
import prisma from "../clients/prisma";
import { Connection, PublicKey } from "@solana/web3.js";
export const getSuggestedUsername = async (user_id: string) => {
  const connection = new Connection(
    `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
  );

  const parser = new TldParser(connection);
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      public_address: true,
    },
  });
  let username = [] as string[];
  console.log(user);

  let wallet = new PublicKey("4vDHQPxjLsCWcAUCaWP8wqLFvv35FTCQZFf31nHCCCkF");

  let allDomais = await parser.getParsedAllUserDomains(wallet);
  allDomais.forEach((domain) => {
    username.includes(domain.domain.split(".")[0]) ||
    username.push(domain.domain.split(".")[0]);
  });

  return username;
};
