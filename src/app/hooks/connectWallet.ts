import toast from "react-hot-toast";
import getWallet from "./whichWallet";

export const connectWallet = async () => {
  const wallet = getWallet();
  if (wallet) {
    const response = await wallet.connect();
    if (response || response.publicKey) {
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
