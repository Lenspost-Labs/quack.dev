import { fc } from "../clients/fc";
import axios from "axios";
import { NeynarUserInfoResponse } from "../../types";
import prisma from "../clients/prisma";

const getDetailsForFID = async (user_id: string, target_fid: number) => {
  const user_fid = (
    await prisma.user_metadata.findUnique({
      where: {
        user_id: user_id,
      },
      select: {
        fid: true,
      },
    })
  )?.fid as number;

  const user_info_api = `https://api.neynar.com/v1/farcaster/user?fid=${target_fid}&viewerFid=${user_fid}`;
  const user_info_res = await axios.get(user_info_api, {
    headers: {
      api_key: process.env.NEYNAR_API_KEY as string,
    },
  });

  let user_info = user_info_res.data.result.user as NeynarUserInfoResponse;

  return {
    fid: user_info.fid,
    username: user_info.username,
    name: user_info.displayName,
    bio: user_info.profile.bio,
    follower: user_info.followerCount,
    following: user_info.followingCount,
    pfp: user_info.pfp.url,
    follows: user_info?.viewerContext?.following,
    followedBy: user_info?.viewerContext?.followedBy,
  };
};

export default getDetailsForFID;
