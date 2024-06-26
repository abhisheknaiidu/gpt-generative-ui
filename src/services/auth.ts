import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { kvClient } from "./users";
import { bonkToCreditMultiplier } from "@/utils/constants";

const generateBonkSignatureUsageKey = (signature: string) =>
  `purchase-signature:${signature}`;
const generateSolSignatureUsageKey = (signature: string) =>
  `purchase-signature-sol:${signature}`;

export const verifyBurn = async (signature: string | null, amount: number) => {
  if (!signature) {
    throw { status: 400, message: "Missing signature in headers." };
  }

  signature = trimSignature(signature);
  const buffer = Buffer.from(signature, "base64");
  const transaction = Transaction.from(buffer);
  const data =
    transaction.instructions[transaction.instructions.length - 1].data;
  const number = extractInteger(data);
  console.log(
    number,
    amount,
    number === BigInt((amount * 10 ** 5) / bonkToCreditMultiplier)
  );
  if (number !== BigInt((amount * 10 ** 5) / bonkToCreditMultiplier)) {
    throw { status: 400, message: "Invalid amount." };
  }
  const isVerified = transaction.verifySignatures(true);

  if (!isVerified) {
    throw { status: 400, message: "Invalid signature." };
  }

  const key = generateBonkSignatureUsageKey(signature);
  const flag = await kvClient.get<boolean>(key);
  if (flag) {
    throw { status: 400, message: "Signature already used." };
  }
  await kvClient.set(key, true);
  // check if the signature is already user

  return isVerified;
};

const trimSignature = (signature: string) => {
  signature = signature.slice(0, 396);
  return signature;
};

const extractInteger = (buffer: Buffer) => {
  const offset = 1; // Assuming that the integer starts from the second byte (index 1)
  return buffer.readBigUInt64LE(offset);
};

const RPC_URL =
  "https://solana-mainnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake";

export const verifyPayment = async (
  signature: string | null,
  amount: number
) => {
  if (!signature) {
    throw { status: 400, message: "Missing signature in headers." };
  }

  // const sigs = await fetch(RPC_URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Origin: "https://explorer.solana.com",
  //   },
  //   body: JSON.stringify({
  //     method: "getConfirmedSignaturesForAddress2",
  //     jsonrpc: "2.0",
  //     params: [
  //       "5Z2xTTSu4gKtYP1c6RRcdraWz61zuSPgo8BXugviDpik",
  //       {
  //         limit: 50,
  //       },
  //     ],
  //   }),
  // });
  // const data = await sigs.json();
  // console.log("recentTransactions", data);

  const key = generateSolSignatureUsageKey(signature);
  const flag = await kvClient.get<boolean>(key);
  if (flag) {
    throw { status: 400, message: "Signature already used." };
  }
  await kvClient.set(key, true);
};

const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/22rQ_17IgqNqjh6L3zozhPBksczluake",
  {
    commitment: "confirmed",
  }
);
