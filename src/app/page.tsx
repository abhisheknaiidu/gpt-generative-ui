"use client";

import bg from "@/assets/bg.svg";
import bonk from "@/assets/bonk.png";
import { IconBrandGithub, IconSparkles } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Chat() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus?.();
  }, []);

  return (
    <>
      <Image
        src={bg}
        alt="Background"
        className="h-full w-[80vw] mx-auto -z-10 opacity-80 fixed top-0 left-[10vw]"
        objectFit="fill"
        priority
        style={{
          filter: "drop-shadow(0px 4px 36px #B7A100)",
        }}
      />
      <div className="min-h-[100dvh] flex flex-col justify-center items-center py-20 gap-10">
        <div className="flex flex-col gap-5 items-center my-auto">
          <div className="py-2 px-4 flex gap-4 bg-[#020227] bg-opacity-5 rounded-full">
            <div>MORE THAN JUST FAQ</div>
            <Image src={bonk} alt="Bonk" height={24} />
          </div>
          <h1 className="in-s text-7xl text-center uppercase leading-tight">
            Dive Deep into
            <br />
            ANYTHING
          </h1>
          <div className="flex items-center justify-center outline outline-[#ADAA9E] border-opacity-30 p-1.5 rounded-[1.7rem] w-full max-w-[35rem] mt-4 focus-within:outline-[2px] transition-all duration-100">
            <form
              className="w-full bg-white bg-opacity-80 items-center justify-center grid rounded-[1.2rem] pl-4 gap-2"
              style={{
                gridTemplateColumns: "auto 1fr auto",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/${ref.current?.value.toLowerCase().trim()}`);
              }}
            >
              <div className="font-bold">ASK /</div>
              <input
                name="topic"
                type="topic"
                placeholder="WHAT IS DOGE COIN..."
                className="!bg-transparent !border-none !outline-none uppercase"
                ref={ref}
              />
              <button
                type="submit"
                className="btn !rounded-[1.2rem] btn-md !h-[3.5rem]"
              >
                GENERATE
                <IconSparkles color="white" />
              </button>
            </form>
          </div>
        </div>
        <div className="in-s uppercase max-w-[28rem] text-center text-sm opacity-80">
          Dive into the fascinating world of BONK Coin with decks crafted by AI
          to cater to your interests. Our platform empowers everyone to learn
          and grow together
        </div>
      </div>
      <div className="!rotate-90 fixed bottom-14 -right-4">
        <a
          href="https://github.com/abhisheknaiidu/gpt-generative-ui"
          target="_blank"
        >
          <button className="!text-[#FDDE00] btn">
            GiTHUB <IconBrandGithub size={20} color="#FDDE00" />
          </button>
        </a>
      </div>
    </>
  );
}
