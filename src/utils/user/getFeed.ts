import { fc } from "../clients/fc";
import axios from "axios";
import { NeynarCast } from "../../types";

const getFeed = async (limit?: number, cursor?: string) => {
  if (!limit) limit = 25;
  if (limit > 100) throw new Error("Limit must be less than 100");
  const feed_api =
    `https://api.neynar.com/v2/farcaster/feed/frames?limit=${limit}` +
    (cursor ? `&cursor=${cursor}` : "");

  const feed = await axios.get(feed_api, {
    headers: {
      api_key: process.env.NEYNAR_API_KEY as string,
    },
  });

  const casts = feed.data.casts as NeynarCast[];

  cursor = feed.data.next?.cursor as string;

  let feed_text = [] as any[];
  for (let i = 0; i < casts.length; i++) {
    feed_text.push({
      body: casts[i].text,
      author: {
        name: casts[i].author.display_name,
        pfp: casts[i].author.pfp_url,
        username: casts[i].author.username,
        fid: casts[i].author.fid,
      },
      embeds: casts[i].embeds,
      hash: casts[i].hash,
      timestamp: casts[i].timestamp,
      reaction: {
        LIKE: casts[i].reactions?.likes.length,
        RECAST: casts[i].reactions?.recasts.length,
      },
    });
  }
  return {
    feed: feed_text,
    cursor: cursor,
  };
};

export default getFeed;
