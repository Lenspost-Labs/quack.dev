import { fc } from "../clients/fc";
import prisma from "../clients/prisma";
const getCasts = async (user_id: string) => {
  let messages = [] as any[];

  const user_fid = await prisma.user_metadata.findUnique({
    where: {
      user_id,
    },
    select: {
      fid: true,
    },
  });

  if (user_fid?.fid === undefined) {
    return messages;
  }

  const casts = await fc.getCastsByFid({
    fid: user_fid?.fid as number,
    pageSize: 100,
    reverse: true,
  });

  casts.isOk() &&
    casts.value.messages.map((cast) => 
      messages.push({
        body : cast.data?.castAddBody?.text as string,
        embeds : cast.data?.castAddBody?.embeds as any[],
      })
    );

  return messages;
};

export default getCasts;
