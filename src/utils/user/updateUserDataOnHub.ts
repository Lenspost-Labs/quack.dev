import {
  makeUserDataAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  UserDataType,
} from "@farcaster/hub-nodejs";
import bs58 from "bs58";
import prisma from "../clients/prisma";
import { fc } from "../clients/fc";
import { Cast } from "../../types";
import { FrameActionBody } from "@farcaster/hub-nodejs";

const FC_NETWORK = FarcasterNetwork.MAINNET;
const ACCOUNT_PRIVATE_KEY_BS58 = process.env.APP_ACCOUNT_PRIVATE_KEY as string;
const ACCOUNT_PRIVATE_KEY = bs58.decode(ACCOUNT_PRIVATE_KEY_BS58);
const ed25519Signer = new NobleEd25519Signer(ACCOUNT_PRIVATE_KEY);

const updateUserDataOnHub = async (
  user_id: string,
  data: any,
  type: UserDataType
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

    const cast = await makeUserDataAdd(
      {
        type: type,
        value: data,
      },
      dataOptions,
      ed25519Signer
    );

    castResults.push(cast);

    castResults.map((castAddResult) =>
      castAddResult.map(async (castAdd: any) =>
        console.log(
          (await fc.submitMessage(castAdd))._unsafeUnwrap().hash.toString()
        )
      )
    );
  }
};

export default updateUserDataOnHub;
