import { fc } from "../clients/fc";
import axios from "axios";
import { NeynarCast } from "../../types";

const getFeed = async (limit?: number) => {
  if (!limit) limit = 25;
  if (limit > 100) throw new Error("Limit must be less than 100");
  const feed_api = `https://api.neynar.com/v2/farcaster/feed/frames?limit=${limit}`;
  const feed = await axios.get(feed_api , {
    "headers" : {
      "api_key" : process.env.NEYNAR_API_KEY as string
    }
  });
  console.log(process.env.NEYNAR_API_KEY as string)
  const casts = feed.data.casts as NeynarCast[];

  let feed_text = [] as string[];
  for (let i = 0; i < casts.length; i++) {
    feed_text.push(casts[i].text || "");
  }
  return feed_text;
};

export default getFeed;
