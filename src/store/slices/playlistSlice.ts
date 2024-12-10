import { API_ROUTES } from '@/utils/constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Track } from './trackSlice';

interface Playlist {
  id: number;
  title: string;
  user_id: number;
  tracks?: Track[];
}

interface SelectedPlaylistState {
  playlist: Playlist | null;
  loading: boolean;
  error: string | null;
}

// État initial
const initialState: SelectedPlaylistState = {
  playlist: null,
  loading: true,
  error: null,
};

// Thunk pour récupérer une Playlist depuis une API
export const fetchPlaylist = createAsyncThunk(
  'selectedPlaylist/fetchPlaylist',
  async (PlaylistId: string, { rejectWithValue }) => {
    try {
      console.log(
        '🚀 ~ URL:',
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.PLAYLIST}${PlaylistId}`,
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.PLAYLIST}${PlaylistId}`,
      ); // Appel API
      if (!response.ok) {
        throw new Error('Failed to fetch playlist');
      }
      const data = await response.json();
      return data.data as Playlist; // Retourne l'Playlist
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const selectedPlaylistSlice = createSlice({
  name: 'selectedPlaylist',
  initialState,
  reducers: {
    // Action pour réinitialiser l'état
    clearSelectedPlaylist(state) {
      state.playlist = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylist.fulfilled, (state, action) => {
        state.playlist = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch playlist';
      });
  },
});

export default selectedPlaylistSlice.reducer;

export const { clearSelectedPlaylist } = selectedPlaylistSlice.actions;
