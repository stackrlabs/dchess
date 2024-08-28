"use client";

import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  // const { resolvedTheme } = useTheme();
  // const image = resolvedTheme === "dark" ? "light" : "dark";
  return (
    <footer className="flex items-center justify-center text-xs md:text font-mono uppercase py-2">
      Powered By
      <Link href="https://stackrlabs.xyz" target="_blank" passHref>
        <Image
          src={`https://assets.stackrlabs.xyz/light.svg`}
          width={72}
          height={72}
          alt="stackr-logo"
        />
      </Link>{" "}
      <p className="mx-2">|</p>
      <Link
        className="flex gap-2 items-center"
        href="https://github.com/stackrlabs/dchess"
        target="_blank"
      >
        Source Code
        <Image
          src={`https://assets.stackrlabs.xyz/github-white.svg`}
          width={18}
          height={18}
          alt="GitHub Logo"
        />
      </Link>
    </footer>
  );
};
