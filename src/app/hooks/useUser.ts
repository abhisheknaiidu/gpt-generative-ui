import { burnBONK } from "@/app/hooks/burnBonk";
import { fetcher, genericMutationFetcher } from "@/utils/swr-fetcher";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

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
  const addCredits = async (credits: number = 5) => {
    const _signature = await burnBONK(
      "A14YRiYmr3psqEMYNTfm16943JBzDPMG3F9oB5A9pk63",
      credits * 10
    );

    if (!_signature) {
      throw { message: "Failed to burn bonk" };
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
