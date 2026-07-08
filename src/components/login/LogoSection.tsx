import Image from "next/image";

interface LogoSectionProps {}

export default function LogoSection({}: LogoSectionProps) {
  return (
    <section className="mb-8 flex flex-col items-center">
      <Image
        src="/logos/logo-gold.png"
        alt="Entertained BAR"
        width={220}
        height={220}
        priority
      />
    </section>
  );
}