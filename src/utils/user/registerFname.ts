import axios from "axios";
import prisma from "../clients/prisma";
import { privateKeyToAccount } from "viem/accounts";
import { bytesToHex } from "viem";
import {
  ViemLocalEip712Signer,
  makeUserDataAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  UserDataType,
} from "@farcaster/hub-nodejs";
import bs58 from "bs58";
import { fc } from "../clients/fc";
import { decrypt } from "../auth/decrypt";

const FC_NETWORK = FarcasterNetwork.MAINNET;
const ACCOUNT_PRIVATE_KEY_BS58 = process.env.APP_ACCOUNT_PRIVATE_KEY as string;
const ACCOUNT_PRIVATE_KEY = bs58.decode(ACCOUNT_PRIVATE_KEY_BS58);
const ed25519Signer = new NobleEd25519Signer(ACCOUNT_PRIVATE_KEY);


const registerFname = async (userId: string) => {
  try {
    let user_pk = await prisma.auth.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        secret_key: true,
        user: {
          select: {
            user_metadata: {
              select: {
                fid: true,
              },
            },
          },
        },
      },
    });
    if (!user_pk) {
      console.error("User does not exist");
    }
    const fid = user_pk?.user?.user_metadata?.fid as number;

    let fname = `quack-${fid}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const user_pk_decrypted = decrypt(user_pk?.secret_key as `0x${string}`);
    const user = privateKeyToAccount(user_pk_decrypted as `0x${string}`);
    const userKey = new ViemLocalEip712Signer(user as any);
    const userNameProofSignature = (
      await userKey.signUserNameProofClaim({
        name: fname,
        timestamp: BigInt(timestamp),
        owner: user.address,
      })
    )._unsafeUnwrap();

    console.log(`Registering fname: ${fname} to fid: ${fid}`);

    let response = await axios.post("https://fnames.farcaster.xyz/transfers", {
      name: fname, // Name to register
      from: 0, // Fid to transfer from (0 for a new registration)
      to: fid, // Fid to transfer to (0 to unregister)
      fid: fid, // Fid making the request (must match from or to)
      owner: user.address, // Custody address of fid making the request
      timestamp: timestamp, // Current timestamp in seconds
      signature: bytesToHex(userNameProofSignature), // EIP-712 signature signed by the current custody address of the fid
    });

    const castResults = [];
    const dataOptions = {
      fid: fid,
      network: FC_NETWORK,
    };
    const userDataPfpBody = {
      type: UserDataType.USERNAME,
      value: fname,
    };
    let userDataPfp = (await makeUserDataAdd(
      userDataPfpBody,
      dataOptions,
      ed25519Signer
    )) as any;
    console.log(userDataPfp);
    castResults.push(userDataPfp);

    console.log("Submitting cast results");
    let res = [] as any;
    castResults.map((castAddResult) =>
      castAddResult.map(async (castAdd: any) => {
        console.log(await fc.submitMessage(castAdd));
        res.push(await fc.submitMessage(castAdd));
      })
    );
    return fname;
  } catch (e: any) {
    console.error(e);
    // @ts-ignore
    // throw new Error(
    //   `Error registering fname: ${JSON.stringify(e.response.data)} (status: ${
    //     e.response.status
    //   })`
    // );
  }
};

export default registerFname;
