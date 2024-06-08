"use client";
import LoadingGIF from "@/assets/loading.gif";
import TopicCard from "@/components/TopicCards/TopicCards";
import { useHashState } from "@/hooks/useHashState";
import { fetcher } from "@/utils/swr-fetcher";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import classNames from "classnames";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

const MAX_W = 500;

export default function Chat() {
  const params = useParams();
  const topic = params.topic;

  const title = decodeURIComponent(topic.toString());
  const [hash, setHash] = useHashState();
  const currentItem = parseInt(hash.split("item")[1] || "0");

  const { data, error, isLoading } = useSWR(
    "/api/generate?topic=" + topic,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    // send prefetch requests for the images
    if (!isLoading && !error && data) {
      data.forEach((item: any, index: number) => {
        fetch(
          `/api/image?prompt=${item.imageGenerationPrompt}&size=${item.imageDimensions}`
        );
      });
    }
  }, [data, error, isLoading]);

  return (
    <div className={`min-h-full`}>
      <div className="pt-[3.9rem] bg-[#FDDE00] flex flex-col items-center justify-center pb-5">
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
            {isLoading || error || !data ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="animate-pulse rounded-3xl bg-white"
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
              </motion.div>
            ) : (
              data.map(
                (item: any, index: number) =>
                  index === currentItem && (
                    <div
                      key={index}
                      id={`item${index}`}
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
                  !data || currentItem === data.length - 1,
              }
            )}
            aria-disabled={!data || currentItem === data.length - 1}
            tabIndex={!data || currentItem === data.length - 1 ? -1 : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (currentItem === data.length - 1) return;
              setHash(`item${currentItem + 1}`);
            }}
          >
            <IconChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
