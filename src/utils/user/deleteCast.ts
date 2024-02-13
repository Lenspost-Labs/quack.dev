import {
  makeCastRemove,
  NobleEd25519Signer,
  FarcasterNetwork,
  MessageData,
  getFarcasterTime,
} from "@farcaster/hub-nodejs";
import bs58 from "bs58";
import prisma from "../clients/prisma";
import { fc } from "../clients/fc";

const FC_NETWORK = FarcasterNetwork.MAINNET;
const ACCOUNT_PRIVATE_KEY_BS58 = process.env.APP_ACCOUNT_PRIVATE_KEY as string;
const ACCOUNT_PRIVATE_KEY = bs58.decode(ACCOUNT_PRIVATE_KEY_BS58);
const ed25519Signer = new NobleEd25519Signer(ACCOUNT_PRIVATE_KEY);

const deleteCast = async (user_id: string, hash: string) => {
  let user_data = await prisma.user_metadata.findUnique({
    where: {
      user_id: user_id,
    },
    select: {
      fid: true,
    },
  });

  let timestamp = getFarcasterTime()._unsafeUnwrap();


  hash = hash.replace("0x", "");
  let targetHash = new Uint8Array(Buffer.from(hash, "hex"));

  if (user_data?.fid) {
    const dataOptions = {
      fid: user_data.fid,
      network: FC_NETWORK,
      timestamp,
    } as MessageData;

    const castResults = [];
    const cast = await makeCastRemove(
      {
        targetHash,
      },
      dataOptions,
      ed25519Signer
    );

    castResults.push(cast);

    castResults.map((castAddResult) =>
      castAddResult.map(async (castAdd: any) =>
        console.log((await fc.submitMessage(castAdd))._unsafeUnwrap().hash.toString())
      )
    );
  }
};

export default deleteCast;
