import { getInsecureHubRpcClient } from "@farcaster/hub-nodejs";

const HUB_URL = process.env.HUB_URL as string;
export const fc = getInsecureHubRpcClient("nemes.farcaster.xyz:2283");