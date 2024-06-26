import { burnBONK } from "@/app/hooks/burnBonk";
import { bonkToCreditMultiplier } from "@/utils/constants";
import { fetcher, genericMutationFetcher } from "@/utils/swr-fetcher";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { payViaSol } from "./payViaSol";

export const useUser = () => {
  const { publicKey } = useWallet();
  const { data, error, isLoading, mutate } = useSWR<{
    data: {
      credits: number;
      createdAt: number;
    };
  }>(
    publicKey && [
      "/api/user",
      "get",
      {
        headers: {
          "x-user-address": publicKey.toBase58(),
        },
      },
    ],
    fetcher
  );

  return {
    user: data?.data,
    error,
    isLoading,
    mutate,
  };
};

export const useCreditsPurchase = () => {
  const { publicKey } = useWallet();
  const { trigger, isMutating } = useSWRMutation(
    "/api/purchase",
    genericMutationFetcher
  );
  const { mutate } = useUser();
  const addCredits = async (credits: number = 5, bonk = false) => {
    let _signature: string | undefined = "";
    if (bonk) {
      _signature = await burnBONK(
        "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        credits / bonkToCreditMultiplier
      );

      if (!_signature) {
        throw { message: "Failed to burn bonk" };
      }
    } else {
      const wagmiQuestPublicKey = new PublicKey(
        "5Z2xTTSu4gKtYP1c6RRcdraWz61zuSPgo8BXugviDpik"
      );
      const message = "test";
      _signature = await payViaSol(wagmiQuestPublicKey, 0.0075, true, message);
      if (!_signature) {
        throw { message: "Failed to pay via sol" };
      }
    }

    await trigger({
      type: "post",
      rest: [
        {
          credits,
        },
        {
          headers: {
            "x-user-address": publicKey?.toBase58(),
            "x-signature": _signature,
          },
        },
      ],
    });
    await mutate();
    toast.success(`Added ${credits} credits successfully`);
  };
  return {
    addCredits,
    isMutating,
  };
};
