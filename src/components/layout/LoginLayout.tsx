import { ReactNode } from "react";
import Image from "next/image";

interface LoginLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({
  children,
}: LoginLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black px-6 py-6">
      {/* Logo */}
      <div className="absolute left-8 top-8">
        <Image
          src="/logos/logo-gold.png"
          alt="Entertained BAR"
          width={130}
          height={130}
          priority
        />
      </div>

      {children}
    </main>
  );
}