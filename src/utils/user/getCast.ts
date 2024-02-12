import { fc } from "../clients/fc";
import prisma from "../clients/prisma";
import getReactionForCast from "../casts/getReactionForCast";
import { CastId } from "@farcaster/hub-nodejs";

const getCast = async (user_id: string) => {
  let m = [] as any[];
  user_id = "b32c8d86-b7c1-4840-82ce-c6e9c0f53dd8";

  let cast = await fc.getCast({
    fid: 11889,
    hash: new Uint8Array(Buffer.from("dacad42adc25b56e791c164043250a72075f8f7c", "hex")),
  });

  if (cast.isOk()) {
    console.log(cast.value.data?.castAddBody);
  }

  return m;
};

export default getCast;
