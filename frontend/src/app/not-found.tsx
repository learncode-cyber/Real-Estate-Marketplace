import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-[color:var(--color-muted)]">The page you asked for does not exist.</p>
      <Link className="underline" href="/">
        Return to the home page
      </Link>
    </main>
  );
}
