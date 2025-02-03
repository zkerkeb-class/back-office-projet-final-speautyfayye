'use client';

import Text from '@/components/textLocale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppDispatch, RootState } from '@/store';
import { fetchTrack, updateTrack } from '@/store/slices/trackSlice';
import { EEntityTypeId, uploadImage } from '@/utils/upload';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UpdateTrackFormProps {
  locale: string;
  id: string;
}

const UpdateTrackForm = ({ locale, id }: UpdateTrackFormProps) => {
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
    dispatch(fetchTrack(id));
  }, [dispatch, id]);

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
      id: Number(id),
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const files = event.target.files;
    if (!files?.length) return;
    uploadImage(EEntityTypeId.track, id, files);
    router.push(`/${locale}/dashboard?tab=tracks`);
  };

  return (
    <Card className="mx-auto mt-4 w-[400px]">
      <CardHeader>
        <h2 className="text-center text-2xl font-bold">
          <Text locale={locale} text="title.form_update_track" />
        </h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              <Text locale={locale} text="tables.key.title" />
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">
              <Text locale={locale} text="tables.key.duration" />
            </Label>
            <Input
              type="number"
              id="duration"
              value={duration ?? ''}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="releaseDate">
              <Text locale={locale} text="tables.key.releaseDate" />
            </Label>
            <Input
              type="date"
              id="releaseDate"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackNumber">
              <Text locale={locale} text="tables.key.trackNumber" />
            </Label>
            <Input
              type="number"
              id="trackNumber"
              value={trackNumber}
              onChange={(e) => setTrackNumber(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="albumId">
              <Text locale={locale} text="tables.key.album_id" />
            </Label>
            <Input
              type="number"
              id="albumId"
              value={albumId}
              onChange={(e) => setAlbumId(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">
              <Text locale={locale} text="tables.key.category_id" />
            </Label>
            <Input
              type="number"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">
              <Text locale={locale} text="tables.key.picture" />
            </Label>
            <Input
              id="picture"
              value={picture || ''}
              type="file"
              onChange={(e) => handleFileChange(e, Number(id))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audio">
              <Text locale={locale} text="tables.key.audio" />
            </Label>
            <Input id="audio" value={audio} onChange={(e) => setAudio(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfPlays">
              <Text locale={locale} text="tables.key.number_of_plays" />
            </Label>
            <Input
              type="number"
              id="numberOfPlays"
              value={numberOfPlays}
              onChange={(e) => setNumberOfPlays(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lyrics">
              <Text locale={locale} text="tables.key.lyrics" />
            </Label>
            <Input
              id="lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Text locale={locale} text="update.loading" />
            ) : (
              <Text locale={locale} text="update.track" />
            )}
          </Button>
        </CardFooter>
      </form>
      {error && <p className="mt-2 text-center text-red-500">{error}</p>}
    </Card>
  );
};

export default UpdateTrackForm;
