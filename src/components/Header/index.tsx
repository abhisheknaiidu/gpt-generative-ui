"use client";

import Logo from "@/assets/logo.svg";
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
        "transition-all duration-500 bg-[#FFFFFF] backdrop-blur-lg mx-auto fixed h-16 flex items-center justify-between w-full",
        {
          "rounded-[2rem] max-w-[40rem] top-7 left-[50%] -translate-x-1/2 px-3 bg-opacity-50":
            isHome,
          "rounded-[0rem] max-w-[100vw] top-0 left-0 bg-opacity-10": !isHome,
        }
      )}
      style={{
        boxShadow: "0px 4px 36.8px 0px rgba(0, 0, 0, 0.05)",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        padding: !isHome ? "0 max(calc(50vw - 22rem), 1rem)" : undefined,
      }}
    >
      <Link href="/">
        <Image src={Logo} alt="Bonk.info" height={36} />
      </Link>
      <button className="btn">CONNECT</button>
    </div>
  );
};

export default Header;
