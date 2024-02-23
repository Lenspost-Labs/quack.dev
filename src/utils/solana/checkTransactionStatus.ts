import { Connection, TransactionSignature } from "@solana/web3.js";
import getParsedTransaction from "./getParsedTransaction";

const SOLANA_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`

async function checkTransactionStatus(
  txSignature: TransactionSignature
): Promise<boolean> {
  const connection = new Connection(SOLANA_RPC_URL);

  let retries = 5;
  while (true) {
    try {
      // Check the transaction status
      if (--retries <= 0) {
        return false;
      }
      const response = await connection.getSignatureStatuses([txSignature], {
        searchTransactionHistory: true,
      });

      const status = response && response.value[0];

      if (status) {
        // If the transaction is confirmed or finalized, return true or false based on error status
        if (
          status.confirmationStatus === "confirmed" ||
          status.confirmationStatus === "finalized"
        ) {
          return !status.err
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error checking transaction status:", error);
      return false;
    }
  }
}

export default checkTransactionStatus;
