import redis from "../clients/redis";
import prisma from "../clients/prisma";

import { userPayed } from "../events";
import createAccount from "../farcaster/createAccount";


const updatePaidStatus = async (
  user_id: string,
  public_key: string,
  memo: string
) => {
  let user_memo = await redis.get(public_key);

  if (user_memo === memo) {
    createAccount(user_id);
    userPayed(user_id);
    await prisma.user_metadata.upsert({
      where: {
        user_id: user_id,
      },
      update: {
        hasPaid: true,
      },
      create: {
        user_id: user_id,
        hasPaid: true,
      },
    });
  }
};

export default updatePaidStatus;
