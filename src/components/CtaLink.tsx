type Variant = "primary" | "outline-dark" | "outline-light";

const base =
  "group inline-flex items-center justify-center gap-3 rounded-[10px] font-semibold tracking-tight transition-[background-color,color,border-color,box-shadow,scale] duration-200 ease-out-soft active:scale-[0.98] active:duration-150 motion-reduce:active:scale-100";

const sizes = {
  md: "min-h-[52px] px-7 text-[0.95rem]",
  sm: "min-h-11 px-5 text-sm",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-rose text-ink hover:bg-rose-soft focus-visible:bg-rose-soft shadow-[0_0_0_1px_rgba(215,163,186,0.35)] hover:shadow-[0_10px_30px_-12px_rgba(215,163,186,0.6)] focus-visible:shadow-[0_10px_30px_-12px_rgba(215,163,186,0.6)]",
  "outline-dark":
    "border border-line-dark text-paper hover:border-rose hover:text-rose-soft focus-visible:border-rose focus-visible:text-rose-soft",
  "outline-light":
    "border border-ink/25 text-ink hover:border-wine hover:text-wine focus-visible:border-wine focus-visible:text-wine",
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={`size-4 shrink-0 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 group-focus-visible:translate-x-1 ${className}`}
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
