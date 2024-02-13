import { fc } from "../clients/fc";
import prisma from "../clients/prisma";
import { CastId } from "@farcaster/hub-nodejs";
import getReactionForCast from "./getReactionForCast";
import { fromFarcasterTime } from "@farcaster/hub-nodejs";

const getCommentsForCast = async (cast_id: CastId) => {
  let r = await fc.getCastsByParent({
    parentCastId: cast_id,
  });

  let comments = [] as any;

  if (r.isOk()) {
    let messages = r.value.messages;

    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];
      let reaction = await getReactionForCast(
        CastId.create({
          fid: message.data?.fid as number,
          hash: message.hash,
        })
      );
      comments.push({
        fid: message.data?.fid as number,
        body: message.data?.castAddBody?.text as string,
        embeds: message.data?.castAddBody?.embeds as any[],
        reaction: reaction,
        timestamp: message.data?.timestamp
          ? new Date(
              fromFarcasterTime(message.data.timestamp)._unsafeUnwrap()
            ).toISOString()
          : "",
        hash: `0x${Buffer.from(message.hash).toString("hex")}`,
        parentCast: `0x${Buffer.from(
          message.data?.castAddBody?.parentCastId?.hash as Uint8Array
        ).toString("hex")}`,
        parentFid: message.data?.castAddBody?.parentCastId?.fid as number,
      });
    }
  }
  return comments;
};

export default getCommentsForCast;
