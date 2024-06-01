"use client";

import TopicCard from "@/components/TopicCards/TopicCards";
import { useHashState } from "@/hooks/useHashState";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import classNames from "classnames";
import Link from "next/link";

const MAX_W = 500;

export default function Chat() {
  const title = "How Bonk Works?";
  const [hash, setHash] = useHashState();
  const currentItem = parseInt(hash.split("item")[1] || "0");
  const data = [
    {
      title: "What is Bonk Coin?",
      description: [
        "Bonk Coin, also known as BONK, is a dog-themed meme coin built on the Solana blockchain.",
        "It was introduced as a free airdrop to the Solana community on Christmas day 2022.",
        "Inspired by popular memecoins like Dogecoin (DOGE), BONK's mascot is a Shiba Inu dog.",
        "Despite having no specific utility initially, BONK has been integrated into more than 110 DeFi, gaming, and other sectors.",
        "Its rapid popularity highlights the community-driven nature of meme coins.",
      ],
      imageGenerationPrompt:
        "An illustration of a Shiba Inu dog in a festive setting, with 'BONK' written across the scene on a blockchain background.",
      imageDimensions: "1024x1024",
    },
    {
      title: "BONK Tokenomics",
      description: [
        "BONK Tokenomics deals with the supply, distribution, and demand of the cryptocurrency.",
        "The project airdropped 50% of its total supply to Solana NFT enthusiasts, DeFi traders, artists, and collectors.",
        "This method of distribution was aimed at reversing the trend of predatory VC tokens on the Solana network.",
        "BONK's supply dynamics helped in garnering a strong and diverse community backing.",
        "Understanding BONK's tokenomics is crucial for anyone looking to invest.",
      ],
      imageGenerationPrompt:
        "A pie chart showing the distribution of BONK tokens along with icons of NFTs, traders, artists, and collectors.",
      imageDimensions: "1792x1024",
    },
    {
      title: "How to Buy BONK",
      description: [
        "BONK can be purchased on multiple major cryptocurrency exchanges including Coinbase, Binance, OKX, and Gate.io.",
        "It's crucial to have a secure wallet compatible with the Solana blockchain for storing BONK.",
        "Prospective buyers should be cautious of scams while claiming BONK airdrops or purchasing from unofficial sources.",
        "Research and verification of the exchange's legitimacy are essential before trading BONK.",
        "Users can also engage in staking BONK to earn yields on various DeFi platforms.",
      ],
      imageGenerationPrompt:
        "A step-by-step infographic showing how to buy BONK on various exchanges, secure wallets, and staking methods.",
      imageDimensions: "1024x1792",
    },
    {
      title: "Unique Features of BONK",
      description: [
        "BONK stands out for its community-driven distribution model and extensive integrations.",
        "Launched during a harsh crypto winter, it quickly surged over 25,000% in value.",
        "BONK offers single-sided staking pools, allowing holders to earn yields without involving a second asset.",
        "Its listing on major exchanges like Coinbase and Binance significantly boosted its legitimacy.",
        "BONK offers derivatives trading on platforms like Bitmex, allowing trades with up to 10x leverage.",
      ],
      imageGenerationPrompt:
        "An illustration showing BONK’s unique features: community distribution, staking pools, exchange listings, and derivatives trading.",
      imageDimensions: "512x512",
    },
    {
      title: "Future Prospects of BONK",
      description: [
        "The future of BONK seems promising, leveraged by its strong community support and integration with DeFi and gaming sectors.",
        "Continuous development and new integrations can further enhance its utility and appeal.",
        "The project aims to be recognized as the 'community coin of Solana,' used across decentralized apps.",
        "Market adoption and legitimacy increase with each new major exchange listing.",
        "As with any investment, potential investors should keep an eye on technological and market risks.",
      ],
      imageGenerationPrompt:
        "A futuristic representation of the Solana blockchain integrated with various sectors like DeFi, gaming, and decentralized apps, all revolving around BONK.",
      imageDimensions: "1024x1024",
    },
  ];

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
            className="carousel flex gap-4"
            style={{
              maxWidth: `${MAX_W / 16}rem`,
            }}
          >
            {data.map((item, index) => (
              <div key={index} id={`item${index}`} className="carousel-item">
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
            ))}
          </div>
          <div
            className={classNames(
              "btn btn-xs !bg-white bg-opacity-70 outline-none border-none px-4 py-1.5 !h-fit",
              {
                "opacity-50 cursor-not-allowed":
                  currentItem === data.length - 1,
              }
            )}
            aria-disabled={currentItem === data.length - 1}
            tabIndex={currentItem === data.length - 1 ? -1 : undefined}
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
