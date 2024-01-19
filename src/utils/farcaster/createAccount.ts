import { BUNDLER_ADDRESS, bundlerABI ,  } from "@farcaster/hub-web";
import { Web3 } from "web3";

const web3 = new Web3(process.env.OP_RPC_URL);
const hub = new web3.eth.Contract(bundlerABI, BUNDLER_ADDRESS);

export const createAccount = async (userId: string) => {
   return await getPriceInEth();
};

export const getPriceInEth = async () => {
    let price = await hub.methods.price(0).call();
    price = web3.utils.fromWei(price, "ether");
    price = parseFloat(price);
    return price;
};

export default createAccount;