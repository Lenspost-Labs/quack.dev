import { fc } from "../clients/fc";
import prisma from "../clients/prisma";
import getReactionForCast from "../casts/getReactionForCast";
import { CastId, fromFarcasterTime } from "@farcaster/hub-nodejs";

const getCast = async (castId: CastId) => {
  let m = [] as any[];

  let cast = await fc.getCast(castId);

  if (cast.isOk()) {
    let reaction = await getReactionForCast(
      CastId.create({
        fid: cast.value.data?.fid as number,
        hash: cast.value.hash,
      })
    );

    m.push({
      body: cast.value.data?.castAddBody?.text as string,
      embeds: cast.value.data?.castAddBody?.embeds as any[],
      reaction: reaction,
      timestamp: cast.value.data?.timestamp
        ? new Date(
            fromFarcasterTime(cast.value.data.timestamp)._unsafeUnwrap()
          ).toISOString()
        : "",
      hash: `0x${Buffer.from(cast.value.hash).toString("hex")}`,
    });
  }

  return m;
};

export default getCast;
