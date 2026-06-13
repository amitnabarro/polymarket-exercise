import Image from "next/image";

interface MarketImageProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { className: "h-8 w-8", px: 32 },
  md: { className: "h-10 w-10", px: 40 },
  lg: { className: "h-14 w-14", px: 56 },
};

export function MarketImage({ src, alt, size = "md" }: MarketImageProps) {
  const { className, px } = SIZES[size];

  if (!src) {
    return (
      <div
        className={`${className} flex shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground`}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      className={`${className} shrink-0 rounded-lg object-cover`}
    />
  );
}
