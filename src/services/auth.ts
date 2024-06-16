import { Transaction } from "@solana/web3.js";
import { kvClient } from "./users";

const generateSignatureUsageKey = (signature: string) =>
  `purchase-signature:${signature}`;

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
  console.log(number, amount, number === BigInt(amount * 10 ** 9));
  if (number !== BigInt(amount * 10 ** 9)) {
    throw { status: 401, message: "Invalid amount." };
  }
  const isVerified = transaction.verifySignatures(true);

  if (!isVerified) {
    throw { status: 401, message: "Invalid signature." };
  }

  const key = generateSignatureUsageKey(signature);
  const flag = await kvClient.get<boolean>(key);
  if (flag) {
    throw { status: 401, message: "Signature already used." };
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
