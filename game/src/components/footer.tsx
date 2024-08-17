"use client";

import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  // const { resolvedTheme } = useTheme();
  // const image = resolvedTheme === "dark" ? "light" : "dark";
  return (
    <footer className="flex items-center justify-center text-xs md:text font-mono uppercase pb-2">
      Powered By
      <Link href="https://stackrlabs.xyz" target="_blank" passHref>
        <Image
          src={`https://assets.stackrlabs.xyz/light.svg`}
          width={100}
          height={100}
          alt="stackr-logo"
        />
      </Link>
    </footer>
  );
};
