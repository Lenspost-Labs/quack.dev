import { Router } from "express";
import { getPriceInEth } from "../../utils/farcaster/createAccount";
import {
  getPriceInSol,
  getPriceInUSDC,
} from "../../utils/solana/getPriceInSol";
import getSerializedTx from "../../utils/solana/getSerializedTx";
const router = Router();

router.get("/pay", async (req, res) => {
  let user = req.user?.id;
  let publicKey = req.user?.public_address;

  let price = await getPriceInEth();
  let priceInSol = await getPriceInSol(price);
  let priceInUSDC = await getPriceInUSDC(price);
  let tx = await getSerializedTx(priceInSol, publicKey as string);

  res.send({
    price: price,
    priceInSol: priceInSol,
    priceInUSDC: priceInUSDC,
    tx: tx,
  });
});

export default router;
