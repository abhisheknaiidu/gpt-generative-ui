import {
  PublicKey,
  Transaction,
  Connection,
  Keypair,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
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
    } else {
      toast.error("Failed to connect to wallet");
      return;
    }
    return wallet.publicKey;
  }
  toast.error("No Solana wallets found");
  window.open("https://phantom.app/", "_blank");
};

function getConnection() {
  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake",
    {
      commitment: "processed",
    }
  );
  return connection;
}

export const payViaSol = async (
  to: PublicKey,
  amount: number,
  showToast?: boolean,
  message?: string
) => {
  const wallet = getWallet();
  const publicKey = await connectWallet();
  const connection = getConnection();

  const roundedNumber = Number(amount.toFixed(5));
  if (!publicKey) return;
  const balance = await connection.getBalance(publicKey);
  if (balance < roundedNumber * LAMPORTS_PER_SOL) {
    toast.error("Insufficient funds to complete the transaction");
    return;
  }
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: to,
      lamports: roundedNumber * LAMPORTS_PER_SOL,
    })
  );
  const latestBlockHash = await connection.getLatestBlockhash("finalized");
  transaction.recentBlockhash = latestBlockHash.blockhash;
  transaction.feePayer = publicKey;

  const signedTransaction = await wallet.signTransaction(transaction);
  try {
    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );
    if (!txid) throw new Error("txid is undefined");
    const verified = connection.confirmTransaction(txid);
    toast.promise(verified, {
      loading: "Confirming Transaction, you can close this tab",
      success: "Transaction Confirmed",
      error: "Transaction Failed",
    });
    return txid;
  } catch (error) {
    console.error(error);
    toast.error("Failed to send transaction");
    return;
  }
};
