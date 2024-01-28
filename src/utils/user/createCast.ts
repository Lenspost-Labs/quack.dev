import {
  makeCastAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
} from "@farcaster/hub-nodejs";
import bs58 from "bs58";
import prisma from "../clients/prisma";
import { fc } from "../clients/fc";
import fs from "fs";

const FC_NETWORK = FarcasterNetwork.MAINNET;
const ACCOUNT_PRIVATE_KEY_BS58 = process.env.APP_ACCOUNT_PRIVATE_KEY as string;
const ACCOUNT_PRIVATE_KEY = bs58.decode(ACCOUNT_PRIVATE_KEY_BS58);
const ed25519Signer = new NobleEd25519Signer(ACCOUNT_PRIVATE_KEY);

const createCast = async (user_id: string, postData?: any) => {
  let user_data = await prisma.user_metadata.findUnique({
    where: {
      user_id: user_id,
    },
    select: {
      fid: true,
    },
  });

  if (user_data?.fid) {
    const dataOptions = {
      fid: user_data.fid,
      network: FC_NETWORK,
    } as any;

    console.log(typeof dataOptions.fid);

    const castResults = [];
    const cast = (await makeCastAdd(
      {
        text: postData.text,
        embeds: [],
        embedsDeprecated: [],
        mentions: [],
        mentionsPositions: [],
      },
      dataOptions,
      ed25519Signer
    )) as any;

    castResults.push(cast);

    castResults.map((castAddResult) =>
      castAddResult.map(async (castAdd: any) =>
        console.log(await fc.submitMessage(castAdd))
      )
    );
  }
};

export default createCast;
