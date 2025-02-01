'use client';

import { AppDispatch, RootState } from '@/store';
import { clearSelectedPlaylist } from '@/store/slices/playlistSlice';
import { fetchUserPlaylists } from '@/store/slices/userSlice';
// import { headers } from 'next/headers';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

export default function Home() {
  const title = 'Speautyfayye';
  const { user, loading, error } = useSelector((state: RootState) => state.selectedUser);
  const dispatch = useDispatch<AppDispatch>();

  const handleFetchPlaylist = (userId: number) => {
    dispatch(fetchUserPlaylists(userId));
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
        {/* <Header locale={locale} /> */}
        <p>{title}</p>
        <div>
          <h1>Playlist Details</h1>
          <button onClick={() => handleFetchPlaylist(1)}>Load Artist</button>
          <button onClick={() => dispatch(clearSelectedPlaylist())}>Clear</button>

          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {}
          {user && (
            <>
              <h2>User Information</h2>
              <p>Name: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>Password: {user.password}</p>
              {user.playlists && user.playlists.length > 0 ? (
                user.playlists.map((playlist) => (
                  <div key={playlist.id}>
                    <h2>{playlist.title}</h2>
                    <p>userId: {playlist.user_id}</p>
                  </div>
                ))
              ) : (
                <p>No playlists available</p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
