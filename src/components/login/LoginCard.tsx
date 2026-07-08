interface LoginCardProps {
  children: React.ReactNode;
}

export default function LoginCard({
  children,
}: LoginCardProps) {
  return (
    <section
      className="
        relative
        w-full
        max-w-5xl
        min-h-[700px]
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        shadow-2xl
      "
    >
      {/* Background */}
      <div
        className="
          absolute
          inset-0
          bg-[url('/backgrounds/login-bg.jpg')]
          bg-cover
          bg-center
        "
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Glass Effect */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-10">
        {children}
      </div>
    </section>
  );
}