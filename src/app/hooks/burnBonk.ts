import { PublicKey, Transaction, Connection, Keypair } from "@solana/web3.js";
import {
  createBurnInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { toast } from "react-hot-toast";
import getWallet from "./whichWallet";

const connectWallet = async () => {
  const wallet = getWallet();
  if (wallet) {
    const response = await wallet.connect();
    if (response && response.publicKey) {
      toast.success("Connected to wallet");
    } else {
      toast.error("Failed to connect to wallet");
      return;
    }
    return wallet.publicKey;
  }
  toast.error("No Solana wallets found");
  window.open("https://phantom.app/", "_blank");
};

export const burnBONK = async (mint: string, amount: number) => {
  const wallet = getWallet();
  const burner = await connectWallet();
  const connection = new Connection(
    "https://solana-devnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake",
    {
      commitment: "processed",
    }
  );

  const burnerAccountAddress = getAssociatedTokenAddressSync(
    new PublicKey(mint),
    burner
  );
  const burnerAccount = await connection.getAccountInfo(burnerAccountAddress);
  debugger;

  if (burnerAccount === null) {
    console.log("Burner account does not exist");
    return null;
  }

  const transaction = new Transaction();

  // Add token burn instructions to transaction
  transaction.add(
    createBurnInstruction(
      burnerAccountAddress,
      new PublicKey(mint),
      burner,
      amount * 10 ** 4
    )
  );
  debugger;
  let signedTransaction: any = null;
  const { blockhash } = await connection.getLatestBlockhash("finalized");
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = burner;

  if (wallet) {
    try {
      signedTransaction = await wallet.signTransaction(transaction);
    } catch (e: any) {
      return;
    }
  } else return;

  const txid = await connection
    .sendRawTransaction(signedTransaction.serialize())
    .catch((err) => {
      console.log(err);
    });
  if (txid) {
    return txid;
  }
  toast.error("Failed to send transaction");
};
