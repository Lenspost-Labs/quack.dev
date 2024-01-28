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

const APP_FID = BigInt(process.env.APP_FID as string);
const addSigner = async (user_id: string) => {
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
      secret_key: true,
    },
  });

  const alice = privateKeyToAccount(auth?.secret_key as `0x${string}`) as any;
  const aliceAccountKey = new ViemLocalEip712Signer(alice);
  console.log("Alice:", alice.address);

  const getDeadline = () => {
    const now = Math.floor(Date.now() / 1000);
    const oneHour = 60 * 60;
    return BigInt(now + oneHour);
  };

  const deadline = getDeadline();

  const privateKeyBytes = ed.utils.randomPrivateKey();
  const accountKey = new NobleEd25519Signer(privateKeyBytes);

  let accountPubKey = new Uint8Array();
  const accountKeyResult = await accountKey.getSignerKey();
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
        args: [alice.address],
      });

      console.log("alice nonce");

      let aliceSignature = await aliceAccountKey.signAdd({
        owner: alice.address,
        keyType: 1,
        key: accountPubKey,
        metadataType: 1,
        metadata,
        nonce: aliceNonce,
        deadline,
      });

      console.log("alice sig");

      if (aliceSignature.isOk()) {
        const { request } = await publicClient.simulateContract({
          account: app,
          address: KEY_GATEWAY_ADDRESS,
          abi: keyGatewayABI,
          functionName: "addFor",
          args: [
            alice.address,
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

export default addSigner;
