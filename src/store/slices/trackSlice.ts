import { API_ROUTES } from '@/utils/constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Track {
  id: number;
  title: string;
  duration: number | undefined;
  releaseDate: Date;
  trackNumber: number;
  album_id: number;
  category_id: number;
  picture: string | undefined;
  audio: string;
  number_of_plays: number;
  lyrics: string | undefined;
}
interface SelectedTrackState {
  track: Track | null;
  tracks: Track[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: SelectedTrackState = {
  track: null,
  tracks: null,
  loading: true,
  error: null,
};

export const fetchTrack = createAsyncThunk(
  'selectedTrack/fetchTrack',
  async (trackId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.TRACK}${trackId}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch track');
      }
      return (await response.json()).data as Track;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchAllTracks = createAsyncThunk(
  'selectedTrack/fetchAllTracks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.TRACK}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tracks');
      }
      const data = await response.json();
      return data.data as Track[];
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createTrack = createAsyncThunk(
  'selectedTrack/createTrack',
  async (newTrack: Omit<Track, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.TRACK}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrack),
      });
      if (!response.ok) {
        throw new Error('Failed to create track');
      }
      const data = await response.json();
      return data.data as Track;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteTrack = createAsyncThunk(
  'selectedTrack/deleteTrack',
  async (trackId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.TRACK}${trackId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to delete track');
      }
      return trackId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateTrack = createAsyncThunk(
  'selectedTrack/updateTrack',
  async (track: Track, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.TRACK}${track.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(track),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to update track');
      }
      const data = await response.json();
      return data.data as Track;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const selectedTrackSlice = createSlice({
  name: 'selectedTrack',
  initialState,
  reducers: {
    clearSelectedTrack(state) {
      state.track = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrack.fulfilled, (state, action) => {
        state.track = action.payload;
        state.loading = false;
      })
      .addCase(fetchTrack.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch track';
      })
      .addCase(fetchAllTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTracks.fulfilled, (state, action) => {
        state.tracks = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllTracks.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch tracks';
      })
      .addCase(deleteTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.tracks = state.tracks
          ? state.tracks.filter((track) => track.id !== action.payload)
          : null;
        state.loading = false;
      })
      .addCase(deleteTrack.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to delete track';
      })
      .addCase(createTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrack.fulfilled, (state, action) => {
        state.tracks = state.tracks ? [...state.tracks, action.payload] : [action.payload];
        state.loading = false;
      })
      .addCase(createTrack.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to create track';
      })
      .addCase(updateTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrack.fulfilled, (state, action) => {
        state.tracks = state.tracks
          ? state.tracks.map((track) => (track.id === action.payload.id ? action.payload : track))
          : null;
        state.loading = false;
      })
      .addCase(updateTrack.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to update track';
      });
  },
});

export default selectedTrackSlice.reducer;

export const { clearSelectedTrack } = selectedTrackSlice.actions;
