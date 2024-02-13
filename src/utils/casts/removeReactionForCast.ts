import { fc } from "../clients/fc";
import prisma from "../clients/prisma";
import {
  makeReactionRemove,
  NobleEd25519Signer,
  FarcasterNetwork,
  CastId,
} from "@farcaster/hub-nodejs";
import bs58 from "bs58";

const FC_NETWORK = FarcasterNetwork.MAINNET;
const ACCOUNT_PRIVATE_KEY_BS58 = process.env.APP_ACCOUNT_PRIVATE_KEY as string;
const ACCOUNT_PRIVATE_KEY = bs58.decode(ACCOUNT_PRIVATE_KEY_BS58);
const ed25519Signer = new NobleEd25519Signer(ACCOUNT_PRIVATE_KEY);

const removeReactionForCast = async (
  user_id: string,
  cast_id: CastId,
  reaction_type: number
) => {
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

    const castResults = [];
    const cast = await makeReactionRemove(
      {
        targetCastId: cast_id,
        type: reaction_type,
      },
      dataOptions,
      ed25519Signer
    );

    castResults.push(cast);

    castResults.map((castReactResult) =>
      castReactResult.map(async (castAdd: any) =>
        console.log(
          (await fc.submitMessage(castAdd))._unsafeUnwrap().hash.toString()
        )
      )
    );
  }
};

export default removeReactionForCast;
