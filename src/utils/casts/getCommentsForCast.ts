import { fc } from "../clients/fc";
import prisma from "../clients/prisma";
import { CastId } from "@farcaster/hub-nodejs";

const getCommentsForCast = async (cast_id: CastId) => {
  console.log(cast_id);
  let r = await fc.getCast(cast_id);

  let comments = [] as any;

  r.isOk() && console.log(r.value);

  console.log(comments);

  return comments;
};

export default getCommentsForCast;
