import { fc } from "../clients/fc";
import prisma from "../clients/prisma";
import { CastId } from "@farcaster/hub-nodejs";

const getReactionForCast = async (cast_id: CastId) => {

  let r = await fc.getReactionsByCast({
    targetCastId: cast_id,
  });

  let reaction = {
    LIKE: 0,
    RECAST: 0,
  };

  r.isOk() &&
    r.value.messages.map((m) => {
      m.data?.reactionBody?.type === 1 && reaction.LIKE++;
      m.data?.reactionBody?.type === 2 && reaction.RECAST++;
    });

  return reaction;
};

export default getReactionForCast;
