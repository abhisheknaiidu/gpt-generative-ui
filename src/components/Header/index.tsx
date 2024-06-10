"use client";

import Logo from "@/assets/logo.svg";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    // change global css var --global-bg based on isHome
    document.documentElement.style.setProperty(
      "--global-bg",
      isHome ? "#FDDE00" : "#FFFFFF"
    );
  }, [isHome]);

  return (
    <div
      className={classNames(
        "z-[400] transition-all duration-500 fixed top-0 left-0 w-full items-center justify-center",
        {}
      )}
      style={{
        padding: isHome ? "1rem max(calc(50vw - 18rem), 1rem) 0" : undefined,
      }}
    >
      <div
        className={classNames(
          "transition-all duration-500 bg-[#FFFFFF] h-16 flex items-center justify-between",
          {
            "rounded-[2rem] backdrop-blur-lg px-3 bg-opacity-70": isHome,
            "rounded-[0rem] backdrop-blur-xl bg-opacity-70": !isHome,
          }
        )}
        style={{
          boxShadow: "0px 4px 36.8px 0px rgba(0, 0, 0, 0.05)",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          padding: !isHome ? "0 max(calc(50vw - 18rem), 1rem)" : undefined,
        }}
      >
        <Link href="/">
          <Image src={Logo} alt="Wagmi.quest" height={36} priority />
        </Link>

        <WalletMultiButton
          style={{
            borderRadius: "2rem",
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.9rem",
            backgroundColor: "black",
            fontWeight: 400,
            textTransform: "uppercase",
          }}
        />
      </div>
    </div>
  );
};

export default Header;
