import {
  ID_REGISTRY_ADDRESS,
  idRegistryABI,

} from "@farcaster/hub-nodejs";
import { createPublicClient, http } from "viem";

import { optimism } from "viem/chains";

const getFIDFromOwner = async (address : `0x${string}`) => {
  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(),
  });

  const fid = await publicClient.readContract({
    address: ID_REGISTRY_ADDRESS,
    abi: idRegistryABI,
    functionName: "idOf",
    args: [address],
  });

  return parseInt(fid.toString());
};

export default getFIDFromOwner;