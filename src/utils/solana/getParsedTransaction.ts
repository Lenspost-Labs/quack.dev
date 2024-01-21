const fs = require("fs");
import { Connection } from "@solana/web3.js";

const getParsedTransaction = async (txSig: string)  => {
  const connection = new Connection(process.env.SOLANA_RPC_URL as string);
  let tx = await connection.getTransaction(txSig);

  let logs = tx?.meta?.logMessages as string[] || [];

  for (let i = 0; i < logs.length; i++) {
    if (logs[i].startsWith("Program log: Memo")) {
      let memoLog = logs[i];
      let memo = memoLog.match(/"([^"]+)"/) as string[];
      let memoString = memo[1].split(" ")[1];
      return memoString;
    }
  }
};

export default getParsedTransaction;
