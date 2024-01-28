import {
  makeCastAdd,
  makeCastRemove,
  makeLinkAdd,
  makeLinkRemove,
  makeReactionAdd,
  makeReactionRemove,
  makeUserDataAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  Message,
  MessageData,
} from "@farcaster/hub-nodejs";
import bs58 from "bs58";
import prisma from "../clients/prisma";
import { fc } from "../clients/fc";

const FC_NETWORK = FarcasterNetwork.MAINNET;
const ACCOUNT_PRIVATE_KEY_BS58 = process.env.APP_ACCOUNT_PRIVATE_KEY as string;
const ACCOUNT_PRIVATE_KEY = bs58.decode(ACCOUNT_PRIVATE_KEY_BS58);
const ed25519Signer = new NobleEd25519Signer(ACCOUNT_PRIVATE_KEY);

const createCast = async (user_id: string, postData?: any) => {
  const signerPublicKey = (await ed25519Signer.getSignerKey())._unsafeUnwrap();

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
      fid: user_data.fid as unknown as bigint,
      network: FC_NETWORK,
    } as any;

    const cast = (await makeCastAdd(
      {
        text: "cast from solana",
        embeds: [],
        embedsDeprecated: [],
        mentions: [],
        mentionsPositions: [],
      },
      {
        fid: user_data.fid as unknown as number,
        network: FC_NETWORK,
      },
      ed25519Signer
    )) as any;

    // return cast;
    let res = await fc.submitMessage(cast);
    console.log(res);
  }
};

export default createCast;
