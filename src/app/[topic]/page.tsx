"use client";
import ErrorAnimation from "@/assets/error.json";
import FallbackIcon from "@/assets/FallbackIcon.svg";
import LoadingGIF from "@/assets/loading.gif";
import ImageWithFallback from "@/components/helpers/ImageWithFallback";
import TopicCard from "@/components/TopicCards/TopicCards";
import { useHashState } from "@/hooks/useHashState";
import { fetcher, genericMutationFetcher } from "@/utils/swr-fetcher";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconInfoSquareRounded,
} from "@tabler/icons-react";
import classNames from "classnames";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useCreditsPurchase, useUser } from "../hooks/useUser";
import {
  AssetPrice,
  CHATCoinListData,
  CHATCoinPriceData,
  CHATDataListData,
  ChatDataType,
  ChatItem,
  ChatSource,
  THREAD_TYPE,
} from "../types/chat";

const MAX_W = 550;

const ChatAssetPrice = ({ asset }: { asset: AssetPrice }) => {
  return (
    <div className=" flex items-center justify-between transition-all duration-200 hover:scale-[1.01] rounded-full cursor-pointer">
      <div className="flex items-center gap-3">
        {/* <div className="w-8 h-8 bg-gray-500 rounded-full" /> */}
        <ImageWithFallback
          src={asset.icon && asset.icon !== "null" ? asset.icon : FallbackIcon}
          alt={asset.name}
          width={44}
          height={44}
          className="rounded-full"
          fallbackSrc={FallbackIcon}
        />
        <div className="flex flex-col">
          <h4 className="text-sm uppercase font-semibold text-gray-700">
            {asset.name}
          </h4>
          <p className="text-xs text-gray-500">
            {asset.unit}
            {asset.price}
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <p className={"text-sm ml-auto text-gray-500"}>
          {isNaN(asset.oneDayChange) || isNaN(asset.price)
            ? ""
            : (asset.oneDayChange > 0 ? "+" : "") +
              ((asset.oneDayChange * asset.price) / 100).toLocaleString(
                undefined, // leave undefined to use the visitor's browser
                // locale or a string like 'en-US' to override it.
                { minimumFractionDigits: 2 }
              )}
        </p>
        <p
          className={classNames("text-xs ml-auto", {
            "text-green-500": asset.oneDayChange > 0,
            "text-red-500": asset.oneDayChange < 0,
          })}
        >
          {isNaN(asset.oneDayChange) ? "" : Math.abs(asset.oneDayChange) + "%"}
        </p>
      </div>
    </div>
  );
};

const ChatMessage = ({ chatItem }: { chatItem: ChatItem }) => {
  const { source, type, data } = chatItem;

  if (type === ChatDataType.DATA_LIST) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 1,
          translateX: source === ChatSource.USER ? 10 : -10,
        }}
        animate={{ opacity: 1, scale: 1, translateX: 0 }}
        className="flex flex-col gap-3 p-3 rounded-lg max-w-[90%] bg-black bg-opacity-5 text-gray-500 border-gray-500 border self-start rounded-tl-none"
      >
        <h3 className="text-lg font-bold text-gray-700">
          {(data as CHATDataListData).title}
        </h3>
        <div className="flex flex-col gap-3">
          {(data as CHATDataListData).items.map((item, index) => (
            <div
              key={index}
              className="bg-white flex flex-col p-4 gap-3 rounded-lg transition-all duration-200 hover:shadow-2xl hover:bg-opacity-90"
            >
              <h4 className="font-bold text-gray-600">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === ChatDataType.COINS_LIST) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 1,
          translateX: source === ChatSource.USER ? 10 : -10,
        }}
        animate={{ opacity: 1, scale: 1, translateX: 0 }}
        className="flex flex-col gap-3 p-5 rounded-lg w-[80%] bg-transparent text-gray-500 border-gray-300 border self-start rounded-tl-none"
      >
        <h3 className="text-lg font-bold text-gray-700 mr-10">
          {(data as CHATCoinListData).title}
        </h3>
        <div className="flex flex-col gap-3">
          {(data as CHATCoinListData).items.map((item, index) => (
            <>
              <div
                className="bg-black bg-opacity-10 h-[1px] w-full"
                key={index * 2}
              />
              <ChatAssetPrice asset={item} key={index * 2 + 1} />
            </>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === ChatDataType.COIN_PRICE) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 1,
          translateX: source === ChatSource.USER ? 10 : -10,
        }}
        animate={{ opacity: 1, scale: 1, translateX: 0 }}
        className="flex flex-col gap-3 p-5 rounded-lg w-[80%] bg-transparent text-gray-500 border-gray-300 border self-start rounded-tl-none"
      >
        <h3 className="text-lg font-bold text-gray-700 mr-10">
          {(data as CHATCoinPriceData).title}
        </h3>
        <div className="flex flex-col gap-3">
          <div className="bg-black bg-opacity-10 h-[1px] w-full" />
          <ChatAssetPrice asset={(data as CHATCoinPriceData).asset} />
        </div>
      </motion.div>
    );
  }

  // ChatDataType.TEXT_MESSAGE or any other type
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 1,
        translateX: source === ChatSource.USER ? 10 : -10,
      }}
      animate={{ opacity: 1, scale: 1, translateX: 0 }}
      className={classNames("p-2.5 px-4 rounded-lg max-w-[95%]", {
        "bg-[#FDDE00] self-end border border-gray-300 rounded-tr-none":
          source === ChatSource.USER,
        "bg-transparent border-gray-300 border self-start rounded-tl-none":
          source === ChatSource.WAGMI_AI,
      })}
    >
      <Markdown
        components={{
          span: ({ node, ...props }) => (
            <span className="text-gray-600" {...props} />
          ),
          p: ({ node, ...props }) => <p className="text-gray-600" {...props} />,
        }}
      >
        {data}
      </Markdown>
    </motion.div>
  );
};

export default function Page() {
  const initialCallDone = useRef(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const query = params.topic;
  const threadType =
    (searchParams.get("type") as THREAD_TYPE) ?? THREAD_TYPE.DISCUSS;
  const { publicKey } = useWallet();
  const { mutate, user } = useUser();
  const { addCredits } = useCreditsPurchase();

  const title = decodeURIComponent(query.toString());
  const [hash, setHash] = useHashState();
  const currentItem = parseInt(hash.split("item")[1] || "0");

  const isExplainer = threadType === THREAD_TYPE.EXPLAIN;
  const shouldLoadCarousel = publicKey?.toBase58() && isExplainer;
  const { data, error, isLoading } = useSWR(
    [
      shouldLoadCarousel ? "/api/generate?topic=" + query : null,
      "get",
      {
        headers: {
          "x-user-address": publicKey?.toBase58(),
        },
      },
    ],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { trigger, isMutating } = useSWRMutation(
    "/api/discuss",
    genericMutationFetcher
  );

  const [messages, setMessages] = useState<ChatItem[]>(
    isExplainer
      ? [
          {
            source: ChatSource.WAGMI_AI,
            type: ChatDataType.TEXT_MESSAGE,
            data: "How can I help you?",
          },
        ]
      : [
          {
            source: ChatSource.USER,
            type: ChatDataType.TEXT_MESSAGE,
            data: decodeURIComponent(query.toString()),
          },
        ]
  );

  const [messageToSend, setMessageToSend] = useState<string>("");

  useEffect(() => {
    // send prefetch requests for the images
    if (!isLoading && !error && data) {
      data.data.forEach((item: any, index: number) => {
        fetch(
          `/api/image?prompt=${item.imageGenerationPrompt}&size=${item.imageDimensions}`
        );
      });
      mutate();
    }
  }, [data, error, isLoading]);

  const processChat = async () => {
    // API call to get the response
    const response = await trigger({
      type: "post",
      rest: [
        {
          history: !isExplainer && !initialCallDone.current ? [] : messages,
          message:
            !isExplainer && !initialCallDone.current
              ? messages[0].data
              : messageToSend,
        },
        {
          headers: {
            "x-user-address": publicKey?.toBase58(),
          },
        },
      ],
    });

    await mutate();

    setMessages((prev) => [...prev, response.data]);
  };

  useEffect(() => {
    // if non explainer then process the chat
    if (isExplainer || !publicKey) return;

    if (initialCallDone.current) return;
    processChat();
    initialCallDone.current = true;
  }, [publicKey]);

  const handleSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isMutating || isLoading || messageToSend.trim() === "") return;

    if (!user) {
      return toast.error("Please connect your wallet to continue");
    }

    if (user.credits < 1) {
      return toast.error("Insufficient credits. add credits to continue.");
      // await addCredits(1);
    }

    if (messageToSend.trim() === "") return;
    setMessages((prev) => [
      ...prev,
      {
        source: ChatSource.USER,
        type: ChatDataType.TEXT_MESSAGE,
        data: messageToSend,
      },
    ]);
    setMessageToSend("");

    // // API call to get the response
    // const response = await trigger({
    //   type: "post",
    //   rest: [
    //     {
    //       history: messages,
    //       message: messageToSend,
    //     },
    //     {
    //       headers: {
    //         "x-user-address": publicKey?.toBase58(),
    //       },
    //     },
    //   ],
    // });

    // await mutate();

    // setMessages((prev) => [...prev, response.data]);
    await processChat();
  };

  useEffect(() => {
    // scroll to bottom smoothly
    if (messages.length > 1)
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [messages, isMutating]);

  return (
    <div className={`min-h-full pt-[3.9rem]`}>
      {isExplainer && (
        <div className="bg-[#FDDE00] flex flex-col items-center justify-center pb-5">
          <div
            className="flex items-center justify-center w-full py-5 relative"
            style={{
              maxWidth: `${MAX_W / 16}rem`,
            }}
          >
            <Link href="/" className="absolute left-0">
              <IconChevronLeft />
            </Link>
            <div className="uppercase font-semibold">{title}</div>
          </div>
          <div className="flex gap-5 w-full items-center justify-center">
            <div
              className={classNames(
                "btn btn-xs !bg-white bg-opacity-70 outline-none border-none px-4 py-1.5 !h-fit",
                {
                  "opacity-50 cursor-not-allowed": currentItem === 0,
                }
              )}
              aria-disabled={currentItem === 0}
              tabIndex={currentItem === 0 ? -1 : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (currentItem === 0) return;
                setHash(`item${currentItem - 1}`);
              }}
            >
              <IconChevronLeft size={16} />
            </div>
            <div
              // className="carousel flex gap-4"
              className="flex gap-4"
              style={{
                maxWidth: `${MAX_W / 16}rem overflow-hidden`,
              }}
            >
              {isLoading || !data ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="animate-pulse rounded-3xl bg-white relative flex items-center justify-center"
                  style={{
                    height: `${MAX_W / 16}rem`,
                    width: `${MAX_W / 16}rem`,
                    mixBlendMode: "overlay",
                  }}
                >
                  <Image
                    height={MAX_W}
                    width={MAX_W}
                    src={LoadingGIF}
                    alt="Loading..."
                    className="rounded-3xl opacity-50"
                  />
                  <span className="absolute loading loading-ring w-20"></span>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl bg-white bg-opacity-20 relative flex items-center justify-center flex-col"
                  style={{
                    height: `${MAX_W / 16}rem`,
                    width: `${MAX_W / 16}rem`,
                  }}
                >
                  <Lottie
                    animationData={ErrorAnimation}
                    loop={true}
                    style={{
                      height: `${MAX_W / 50}rem`,
                      width: `${MAX_W / 50}rem`,
                    }}
                  />
                  <h3 className="text-lg text-gray-800 text-center mx-20">
                    {error?.response?.data?.error ??
                      "Something went wrong. Please try again later."}
                  </h3>
                </motion.div>
              ) : (
                data.data.map(
                  (item: any, index: number) =>
                    index === currentItem && (
                      <div
                        key={index}
                        // id={`item${index}`}
                        // className="carousel-item"
                      >
                        <TopicCard
                          cardType={item.imageDimensions}
                          cardIndex={index}
                          cardProps={{
                            title: item.title,
                            description: item.description,
                            // image:
                            //   "https://oaidalleapiprodscus.blob.core.windows.net/private/org-VtjMqVcJ39WS0ytH0Qr3sqxF/user-OyCviQyV6tSxjLBAdKWc2RQ8/img-ChDiS3IAPMBRJeUYErtjjYxY.png?st=2024-05-31T22%3A57%3A52Z&se=2024-06-01T00%3A57%3A52Z&sp=r&sv=2023-11-03&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-05-31T23%3A49%3A30Z&ske=2024-06-01T23%3A49%3A30Z&sks=b&skv=2023-11-03&sig=gQWvw8C0BKe7kXdL173T9cOSTtojtqLxm6f4kexmRWI%3D",
                            image: {
                              prompt: item.imageGenerationPrompt,
                              size: item.imageDimensions,
                            },
                            size: MAX_W,
                          }}
                        />
                      </div>
                    )
                )
              )}
            </div>
            <div
              className={classNames(
                "btn btn-xs !bg-white bg-opacity-70 outline-none border-none px-4 py-1.5 !h-fit",
                {
                  "opacity-50 cursor-not-allowed":
                    !data?.data || currentItem >= data.data.length - 1,
                }
              )}
              aria-disabled={!data?.data || currentItem >= data.data.length - 1}
              tabIndex={
                !data?.data || currentItem >= data.data.length - 1
                  ? -1
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                if (!data?.data || currentItem >= data.data.length - 1) return;
                setHash(`item${currentItem + 1}`);
              }}
            >
              <IconChevronRight size={16} />
            </div>
          </div>
        </div>
      )}
      <div
        className="flex flex-col gap-3 pt-6 w-full mx-auto"
        style={{
          maxWidth: `${MAX_W / 16}rem`,
        }}
      >
        {messages.map((message, index) => (
          <ChatMessage chatItem={message} key={index} />
        ))}
        {isMutating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="loading loading-dots loading-sm mt-10" />
          </motion.div>
        )}
        <div className="h-40" />
      </div>
      <div
        className="fixed bottom-0 w-full flex items-center justify-center pb-4 pt-[3.5rem] px-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 48%)",
        }}
      >
        <div
          className="flex items-center justify-center outline outline-[#02022734] rounded-[1.5rem] w-full focus-within:outline-[3px] focus-within:outline-[#02022766] transition-all duration-100 pl-2"
          style={{
            maxWidth: `${MAX_W / 16}rem`,
          }}
        >
          <form
            className="grid p-2 content-center items-center justify-center w-full gap-3"
            style={{
              gridTemplateColumns: "auto 1fr auto",
            }}
            onSubmit={handleSubmission}
          >
            <div
              className="tooltip rounded-xl tooltip-secondary"
              data-tip="Each info retrieval costs 1 credit"
            >
              <IconInfoSquareRounded color="#FDDE00" />
            </div>
            <input
              name="message"
              type="message"
              placeholder="What is PRICE Of BONK??..."
              className="!bg-transparent !border-none !outline-none uppercase w-full"
              autoComplete="off"
              value={messageToSend}
              onChange={(e) => setMessageToSend(e.target.value)}
            />
            <button
              className={classNames(
                "h-11 py-0 w-12 bg-[#020227] text-white rounded-[1.25rem]",
                {
                  "loading loading-ring loading-xl": isMutating,
                }
              )}
              type="submit"
              disabled={isMutating || isLoading}
            >
              {"->"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
