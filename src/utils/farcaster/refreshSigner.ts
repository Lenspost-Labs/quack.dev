import * as ed from "@noble/ed25519";
import {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  ViemLocalEip712Signer,
  idGatewayABI,
  idRegistryABI,
  NobleEd25519Signer,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
  KEY_REGISTRY_ADDRESS,
  keyRegistryABI,
} from "@farcaster/hub-nodejs";
import { bytesToHex, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimism } from "viem/chains";
import prisma from "../clients/prisma";
import bs58 from "bs58";
import { decrypt } from "../auth/decrypt";

const ACCOUNT_PRIVATE_KEY_BS58 = process.env.APP_ACCOUNT_PRIVATE_KEY as string;
const ACCOUNT_PRIVATE_KEY = bs58.decode(ACCOUNT_PRIVATE_KEY_BS58);
const ed25519Signer = new NobleEd25519Signer(ACCOUNT_PRIVATE_KEY);

const APP_FID = BigInt(process.env.APP_FID as string);
const refreshSigner = async (user_id: string) => {
  const APP_PRIVATE_KEY = process.env.APP_PRIVATE_KEY as `0x${string}`;
  const app = privateKeyToAccount(APP_PRIVATE_KEY);
  const appKey = new ViemLocalEip712Signer(app as any);

  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: optimism,
    transport: http(),
  });

  let auth = await prisma.auth.findUnique({
    where: {
      user_id: user_id,
    },
    select: {
      user: {
        select: {
          public_address: true,
        }
      },
      secret_key: true,
    },
  });


  const user_pk_decrypted = decrypt(auth?.secret_key as `0x${string}`);
  const user = privateKeyToAccount(user_pk_decrypted as `0x${string}`);
  const userAccountKey = new ViemLocalEip712Signer(user as any);
  console.log("user:", user.address);

  const getDeadline = () => {
    const now = Math.floor(Date.now() / 1000);
    const oneHour = 60 * 60;
    const oneDay = 60 * 60 * 24;
    return BigInt(now + oneDay);
  };

  const deadline = getDeadline();

  let accountPubKey = new Uint8Array();
  const accountKeyResult = await ed25519Signer.getSignerKey();
  if (accountKeyResult.isOk()) {
    accountPubKey = accountKeyResult.value;

    const signedKeyRequestMetadata = await appKey.getSignedKeyRequestMetadata({
      requestFid: APP_FID,
      key: accountPubKey,
      deadline,
    });

    console.log("signedkey");

    if (signedKeyRequestMetadata.isOk()) {
      const metadata = bytesToHex(signedKeyRequestMetadata.value);

      let aliceNonce = await publicClient.readContract({
        address: KEY_GATEWAY_ADDRESS,
        abi: keyGatewayABI,
        functionName: "nonces",
        args: [user.address],
      });

      console.log("alice nonce");

      let aliceSignature = await userAccountKey.signAdd({
        owner: user.address,
        keyType: 1,
        key: accountPubKey,
        metadataType: 1,
        metadata,
        nonce: aliceNonce,
        deadline,
      });

      console.log("user sig");

      if (aliceSignature.isOk()) {
        const { request } = await publicClient.simulateContract({
          account: app,
          address: KEY_GATEWAY_ADDRESS,
          abi: keyGatewayABI,
          functionName: "addFor",
          args: [
            user.address,
            1,
            bytesToHex(accountPubKey),
            1,
            metadata,
            deadline,
            bytesToHex(aliceSignature.value),
          ],
        });
        let tx = await walletClient.writeContract(request);
        console.log(tx);
      }
    }
  }
};

export default refreshSigner;
