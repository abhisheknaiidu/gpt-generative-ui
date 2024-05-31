"use client";

import Logo from "@/assets/logo.svg";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div
      className="rounded-full bg-[#FFFFFF88] mx-auto max-w-[40rem] fixed top-7 left-[50%] -translate-x-1/2 h-16 p-3 flex items-center justify-between w-full"
      style={{
        boxShadow: "0px 4px 36.8px 0px rgba(0, 0, 0, 0.05)",
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
