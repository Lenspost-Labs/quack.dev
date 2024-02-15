import axios from "axios";
import { NeynarUser } from "../../types";

const searchUsername = async (q: string, viewer_fid?: number) => {
  viewer_fid = viewer_fid || 1;
  const search_api = `https://api.neynar.com/v2/farcaster/user/search?q=${q}&viewer_fid=${viewer_fid}`;
  const feed = await axios.get(search_api, {
    headers: {
      api_key: process.env.NEYNAR_API_KEY as string,
    },
  });

  const users = feed.data.result.users as NeynarUser[];

  let search_text = [] as any[];
  for (let i = 0; i < users.length; i++) {
    search_text.push({
      fid: users[i].fid,
      username: users[i].username,
      display_name: users[i].display_name,
      pfp: users[i].pfp.url,
    });
  }
  return search_text;
};

export default searchUsername;
