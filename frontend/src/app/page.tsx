import Link from 'next/link';
import { getMessages, resolveLocale } from '@/messages';

interface PageProps {
  readonly searchParams: Promise<{ lang?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const messages = getMessages(locale);

  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-5 p-6">
      <p className="text-sm font-medium text-[color:var(--color-muted)]">{messages.siteName}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{messages.homeTagline}</h1>
      <Link
        href={`/search?lang=${locale}`}
        className="inline-flex min-h-11 w-fit items-center rounded-[var(--radius-md)] bg-[color:var(--color-accent)] px-5 font-semibold text-[color:var(--color-accent-foreground)]"
      >
        {messages.openSearch}
      </Link>
    </main>
  );
}
