import Link from "next/link";

export default function EventNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="mb-2 text-2xl font-bold">Market not found</h1>
      <p className="mb-6 text-muted-foreground">
        This prediction market doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Browse markets
      </Link>
    </div>
  );
}
