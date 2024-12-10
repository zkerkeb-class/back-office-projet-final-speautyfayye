'use client';

import { AppDispatch, RootState } from '@/store';
import { clearSelectedPlaylist, fetchPlaylist } from '@/store/slices/playlistSlice';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

export default function Home() {
  const title = 'Speautyfayye';
  const { playlist, loading, error } = useSelector((state: RootState) => state.selectedPlaylist);
  const dispatch = useDispatch<AppDispatch>();

  const handleFetchPlaylist = (playlistId: string) => {
    dispatch(fetchPlaylist(playlistId));
  };

  return (
    <div className="min-h-screen·grid-rows-[20px_1fr_20px]·items-center·justify-items-center·gap-16·p-8·pb-20·font-[family-name:var(--font-geist-sans)]·sm:p-20">
      <main className="row-start-2·flex·flex-col·items-center·gap-8">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <p>{title}</p>
        <ol className="center·font-[family-name:var(--font-geist-mono)]·text-sm·sm:text-left">
          <li className="mb-2">
            <code className="rounded·bg-black/[.05]·px-1·py-0.5·font-semibold·dark:bg-white/[.06]">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex-col·items-center·gap-4">
          <a
            className="flex·h-10·items-center·justify-center·gap-2·rounded-full·border·border-solid·border-transparent·bg-foreground·px-4·text-sm·text-background·transition-colors·hover:bg-[#383838]·sm:h-12·sm:px-5·sm:text-base·dark:hover:bg-[#ccc]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="flex·h-10·items-center·justify-center·rounded-full·border·border-solid·border-black/[.08]·px-4·text-sm·transition-colors·hover:border-transparent·hover:bg-[#f2f2f2]·sm:h-12·sm:min-w-44·sm:px-5·sm:text-base·dark:border-white/[.145]·dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="flex-wrap·items-center·justify-center·gap-6">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
        <div>
          <h1>Artist Details</h1>
          <button onClick={() => handleFetchPlaylist('1')}>Load Artist</button>
          <button onClick={() => dispatch(clearSelectedPlaylist())}>Clear</button>

          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {playlist && (
            <div>
              <h2>{playlist.title}</h2>
              <p>userId: {playlist.user_id}</p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
