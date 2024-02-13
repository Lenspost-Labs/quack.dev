import { fc } from "../clients/fc";
import prisma from "../clients/prisma";

const doesFollow = async (user_id: string, target_fid: number) => {
  let m = [] as any[];

  let user = await prisma.user_metadata.findUnique({
    where: {
      user_id: user_id,
    },
    select: {
      fid: true,
    },
  });

  let cast = await fc.getLink({
    fid: user?.fid as number,
    linkType: "follow",
    targetFid: target_fid,
  });

  if (cast.isOk()) {
    return cast.value.data?.linkBody?.type === "follow";
  }

  if(cast.isErr()) {
    return false;
  }

};

export default doesFollow;
