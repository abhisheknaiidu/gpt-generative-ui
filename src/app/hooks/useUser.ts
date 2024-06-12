import { fetcher, genericMutationFetcher } from "@/utils/swr-fetcher";
import { useWallet } from "@solana/wallet-adapter-react";
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
    await trigger({
      type: "post",
      rest: [
        {
          credits: credits,
        },
        {
          headers: {
            "x-user-address": publicKey?.toBase58(),
          },
        },
      ],
    });
    await mutate();
  };
  return {
    addCredits,
    isMutating,
  };
};
