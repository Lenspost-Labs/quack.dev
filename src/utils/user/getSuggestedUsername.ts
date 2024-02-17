import prisma from "../clients/prisma";
import { Connection, PublicKey } from "@solana/web3.js";

import {
  walletAddressToDotAnything,
  walletAddressToDotBackpack,
  walletAddressToDotSol,
} from "../sol-wallet-names";

export const getSuggestedUsername = async (user_id: string) => {
  const connection = new Connection(
    `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
  );

  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      public_address: true,
    },
  });


  const walletAddress = new PublicKey(user?.public_address as string);

  let r0 = await walletAddressToDotSol(connection, walletAddress);
  let r1 = await walletAddressToDotBackpack(walletAddress);
  let r2 = await walletAddressToDotAnything(connection, walletAddress);

  return [r0.walletName, r1.walletName, r2.walletName].filter(
    (x) => x !== null
  );
};
