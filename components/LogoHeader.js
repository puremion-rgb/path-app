import Image from "next/image";

export default function LogoHeader({ tint = "dark" }) {
  return (
    <header className="flex items-center px-5 pt-6 pb-2 lg:hidden">
      <Image
        src="/logo/logo-text.svg"
        alt="PATH"
        width={270}
        height={63}
        className="h-7 w-auto"
        style={{ filter: tint === "light" ? "brightness(0) invert(1)" : "none" }}
        priority
      />
    </header>
  );
}
