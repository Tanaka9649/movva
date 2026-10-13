type Variant = "primary" | "outline-dark" | "outline-light";

const base =
  "group inline-flex items-center justify-center gap-3 rounded-full font-semibold tracking-tight transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-out-soft active:translate-y-px";

const sizes = {
  md: "min-h-12 px-6 text-[0.95rem]",
  sm: "min-h-10 px-4 text-sm",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-bronze text-ink hover:bg-bronze-soft shadow-[0_0_0_1px_rgba(194,154,98,0.35)] hover:shadow-[0_10px_30px_-12px_rgba(194,154,98,0.6)]",
  "outline-dark":
    "border border-line-dark text-paper hover:border-bronze hover:text-bronze-soft",
  "outline-light":
    "border border-ink/25 text-ink hover:border-bronze-deep hover:text-bronze-deep",
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={`size-4 shrink-0 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 ${className}`}
    >
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Link interno que sempre leva à seção de inscrição (#inscricao). */
export function CtaLink({
  children,
  variant = "primary",
  size = "md",
  className = "",
  arrow = true,
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <a href="#inscricao" className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </a>
  );
}

export const buttonClasses = { base, sizes, variants };
