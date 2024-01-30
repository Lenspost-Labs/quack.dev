import { fc } from "../clients/fc";
const getCasts = async (user_id: string) => {
  let messages = [] as string[];
  const casts = await fc.getCastsByFid({
    fid: 231703,
    pageSize: 10,
    // reverse: true,
  });
  casts.isOk() &&
    casts.value.messages.map((cast) =>
      messages.push(cast.data?.castAddBody?.text as string)
    );
  return messages;
};

export default getCasts;
