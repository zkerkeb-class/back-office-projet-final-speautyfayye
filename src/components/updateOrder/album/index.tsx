'use client';

import Text from '@/components/textLocale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AppDispatch, RootState } from '@/store';
import {
  fetchAlbum,
  updateAlbumTrackOrder,
  UpdateAlbumTrackOrderPayload,
} from '@/store/slices/albumSlice';
import { Track } from '@/store/slices/trackSlice';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UpdateAlbumOrderProps {
  id: string;
  locale: string;
}

const UpdateAlbumOrder = ({ id, locale }: UpdateAlbumOrderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { album } = useSelector((state: RootState) => state.selectedAlbum);
  const [tracks, setTracks] = useState<{ id: number; track: Track }[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchAlbum(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (album?.tracks) {
      const tracksOrdered = album.tracks
        .slice()
        .sort((a, b) => a.trackNumber - b.trackNumber)
        .map((track: Track) => ({ id: track.id, track }));
      setTracks(tracksOrdered);
    }
  }, [album]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const newTracks = Array.from(tracks);
    const [reorderedItem] = newTracks.splice(result.source.index, 1);
    newTracks.splice(result.destination.index, 0, reorderedItem);

    setTracks(newTracks);
  };

  const handleSubmit = async () => {
    if (album) {
      const payload: UpdateAlbumTrackOrderPayload = { id: album.id, organizedTracks: [] };
      tracks.forEach((track, index) => {
        const trackPayload: {
          id: number;
          position: number;
        } = { id: track.id, position: index + 1 };
        payload.organizedTracks.push(trackPayload);
      });

      dispatch(updateAlbumTrackOrder(payload));
    }
  };

  return (
    <Card className="mx-auto mt-10 w-[400px]">
      <CardHeader>
        <h2 className="text-center text-2xl font-bold">
          <Text locale={locale} text="title.reorder_tracks" />
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {album && (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="tracks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="h-[221.69px] space-y-2 overflow-y-auto"
                >
                  {tracks &&
                    tracks.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cursor-pointer rounded border bg-gray-100 p-2 shadow-sm"
                          >
                            {item.track.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        <Button onClick={handleSubmit}>
          <Text locale={locale} text="actions.save" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpdateAlbumOrder;
