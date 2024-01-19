import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";
const crypto = require("crypto");
import { createMemoInstruction } from "@solana/spl-memo";

const DESTINATION_WALLET = process.env.DESTINATION_WALLET as string;

function generateUniqueCode(userPublicKey: string) {
  const publicKeyHash = crypto
    .createHash("sha256")
    .update(userPublicKey + process.env.MEMO_SALT)
    .digest("hex")
    .substring(0, 4);

  const pseudoRandomness = Math.floor(Math.random() * 10000);

  const timestamp = Math.floor(Date.now() / 1000);
  const timestampComponent = timestamp
    .toString(36)
    .toUpperCase()
    .substring(0, 4);
  const uniqueCode = publicKeyHash + (pseudoRandomness + timestampComponent);

  return uniqueCode;
}

export const getSerializedTx = async (
  amountInSol: number,
  fromPubkey: string
) => {
  const connection = new Connection("https://api.devnet.solana.com");
  let destinationWallet = new PublicKey(DESTINATION_WALLET);
  let sourceWallet = new PublicKey(fromPubkey);
  let amountInLamports = amountInSol * LAMPORTS_PER_SOL;
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sourceWallet,
      toPubkey: destinationWallet,
      lamports: amountInLamports,
    })
  );
  const memoIx = createMemoInstruction(
    `Solcaster ${generateUniqueCode(fromPubkey)}`
  );
  tx.add(memoIx);
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = sourceWallet;
  return tx
    .serialize({
      requireAllSignatures: false,
    })
    .toString("base64");
};

export default getSerializedTx;
