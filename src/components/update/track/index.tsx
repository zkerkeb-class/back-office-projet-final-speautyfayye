'use client';

import Text from '@/components/textLocale';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store';
import { fetchTrack, updateTrack } from '@/store/slices/trackSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UpdateTrackFormProps {
  locale: string;
  id: string;
}

const UpdateTrackForm = ({ locale, id: trackId }: UpdateTrackFormProps) => {
  const { t } = useTranslation(locale);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { track, loading, error } = useSelector((state: RootState) => state.selectedTrack);

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [releaseDate, setReleaseDate] = useState('');
  const [trackNumber, setTrackNumber] = useState(0);
  const [albumId, setAlbumId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [picture, setPicture] = useState<string | undefined>(undefined);
  const [audio, setAudio] = useState('');
  const [numberOfPlays, setNumberOfPlays] = useState(0);
  const [lyrics, setLyrics] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchTrack(trackId));
  }, [dispatch, trackId]);

  useEffect(() => {
    if (track) {
      setTitle(track.title);
      setDuration(track.duration);
      setReleaseDate(track.releaseDate.toString().split('T')[0]);
      setTrackNumber(track.trackNumber);
      setAlbumId(track.album_id);
      setCategoryId(track.category_id);
      setPicture(track.picture);
      setAudio(track.audio);
      setNumberOfPlays(track.number_of_plays);
      setLyrics(track.lyrics);
    }
  }, [track]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTrack = {
      id: Number(trackId),
      title,
      duration,
      releaseDate: new Date(releaseDate),
      trackNumber,
      album_id: albumId,
      category_id: categoryId,
      picture,
      audio,
      number_of_plays: numberOfPlays,
      lyrics,
    };
    dispatch(updateTrack(updatedTrack))
      .unwrap()
      .then(() => {
        console.info('Track updated successfully');
        router.push(`/${locale}/dashboard?tab=tracks`);
      })
      .catch((err) => {
        console.error('Failed to update track:', err);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <Text locale={locale} text="tables.key.title" />:
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.duration" />:
          <input
            type="number"
            id="duration"
            value={duration ?? ''}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.releaseDate" />:
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.trackNumber" />:
          <input
            type="number"
            id="trackNumber"
            value={trackNumber}
            onChange={(e) => setTrackNumber(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.album_id" />:
          <input
            type="number"
            id="albumId"
            value={albumId}
            onChange={(e) => setAlbumId(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.category_id" />:
          <input
            type="number"
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.picture" />:
          <input
            type="text"
            id="picture"
            value={picture || ''}
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.audio" />:
          <input
            type="text"
            id="audio"
            value={audio}
            onChange={(e) => setAudio(e.target.value)}
            required
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.number_of_plays" />:
          <input
            type="number"
            id="numberOfPlays"
            value={numberOfPlays}
            onChange={(e) => setNumberOfPlays(Number(e.target.value))}
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.lyrics" />:
          <textarea
            className="w-2/3"
            id="lyrics"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <Text locale={locale} text="update.loading" />
          ) : (
            <Text locale={locale} text="update.track" />
          )}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UpdateTrackForm;
