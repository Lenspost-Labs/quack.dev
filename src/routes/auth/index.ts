import { Router } from "express";
import registerRouter from "./register";
import prisma from "../../utils/clients/prisma";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { generateJWT } from "../../utils/auth/generateJWT";
import authenticate from "../../middleware/auth";
import { userLogin, userLoginFirstTime } from "../../utils/events";
import { getOrCreatePublicKey } from "../../utils/farcaster/generateKeypair";

const authRouter = Router();

authRouter.post("/", async (req, res) => {
  let user_id = req.user?.id;
  let signature, message, solana_address;

  try {
    signature = req.body.signature;
    message = req.body.message;
    solana_address = req.body.solana_address;
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "Invalid Request Parameters",
    });
    return;
  }

  try {
    let ownerData;

    ownerData = await prisma.user.findUnique({
      where: {
        public_address: solana_address,
      },
    });

    let isVerified = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(solana_address)
    );

    if (!isVerified) {
      res.status(401).send({
        message:
          "Invalid Signature for Solana, please sign using correct message",
      });
      return;
    } else {
      if (!ownerData) {
        ownerData = await prisma.user.create({
          data: {
            public_address: solana_address,
          },
        });
        userLoginFirstTime(ownerData.id);
      } else {
        userLogin(ownerData.id);
      }

      let evm_add = await getOrCreatePublicKey(ownerData.id);

      let jwt = generateJWT({
        id: ownerData.id,
        usernamee: ownerData.username,
        public_address: ownerData.public_address,
        evm_address: evm_add,
      });

      //   if (!user_id) sendLogin(ownerData.id, ownerData.username);
      res.status(200).send({
        jwt,
        userId: ownerData.id,
        username: ownerData.username || "",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `Invalid Server Error: ${error}`,
    });
  }
});

authRouter.use("/register", authenticate, registerRouter);

export default authRouter;
