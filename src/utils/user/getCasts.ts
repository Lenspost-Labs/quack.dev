import { fc } from "../clients/fc";
import fs from "fs";
const getCasts = async (user_id: string) => {
  console.log("getCasts");
  const casts = await fc.getCastsByFid({
    fid: 231703,
    pageSize: 10,
    // reverse: true,
  });
  casts.isOk() && casts.value.messages.map((cast) => console.log(cast));
  console.log(casts);
  return casts;
};

export default getCasts;
