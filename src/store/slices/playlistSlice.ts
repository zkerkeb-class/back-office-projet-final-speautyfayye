import { API_CRUD, API_ROUTES } from '@/utils/constants';
import { removeKey } from '@/utils/helpers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Playlist {
  id: number;
  title: string;
  user_id: number;
}

interface SelectedPlaylistState {
  playlist: Playlist | null;
  playlists: Playlist[] | null;
  loading: boolean;
  error: string | null;
}

type createPlaylist = Omit<Playlist, 'id'>;

// État initial
const initialState: SelectedPlaylistState = {
  playlist: null,
  playlists: null,
  loading: false,
  error: null,
};

// Thunk pour récupérer une Playlist depuis une API
export const fetchPlaylist = createAsyncThunk(
  'selectedPlaylist/fetchPlaylist',
  async (PlaylistId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.PLAYLIST}${PlaylistId}`,
      ); // Appel API
      if (!response.ok) {
        throw new Error('Failed to fetch playlist');
      }
      const data = await response.json();
      console.log('🚀 ~ data:', data);

      return data.data as Playlist; // Retourne l'Playlist
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchAllPlaylists = createAsyncThunk(
  'selectedPlaylist/fetchAllPlaylists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.PLAYLIST}`);
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      const data = await response.json();
      const playlists = removeKey(data.data, 'tracks');

      return playlists as Playlist[]; // Retourne les Playlists sans la colonne tracks
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk pour créer une nouvelle Playlist
export const createPlaylist = createAsyncThunk(
  'selectedPlaylist/createPlaylist',
  async (newPlaylist: createPlaylist, { rejectWithValue }) => {
    try {
      console.log(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.PLAYLIST}`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.PLAYLIST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlaylist),
      }); // Appel API
      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }
      const data = await response.json();
      return data.data as Playlist; // Retourne la nouvelle Playlist
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk pour mettre à jour une Playlist existante
export const updatePlaylist = createAsyncThunk(
  'selectedPlaylist/updatePlaylist',
  async (updatedPlaylist: Playlist, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.PLAYLIST}${API_CRUD.UPDATE}${updatedPlaylist.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPlaylist),
        },
      ); // Appel API
      if (!response.ok) {
        throw new Error('Failed to update playlist');
      }
      const data = await response.json();
      return data.data as Playlist; // Retourne la Playlist mise à jour
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk pour supprimer une Playlist
export const deletePlaylist = createAsyncThunk(
  'selectedPlaylist/deletePlaylist',
  async (playlistId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}playlist/${playlistId}`, {
        method: 'DELETE',
      }); // Appel API
      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }
      return playlistId;
      // return playlistId; // Retourne l'ID de la Playlist supprimée
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const selectedPlaylistSlice = createSlice({
  name: 'selectedPlaylist',
  initialState,
  reducers: {
    clearSelectedPlaylist(state) {
      state.playlist = null;
      state.playlists = null;
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
      .addCase(fetchPlaylist.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch playlist'; //action.error.message ||
      })
      .addCase(fetchAllPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPlaylists.fulfilled, (state, action) => {
        state.playlists = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPlaylists.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch playlists'; //action.error.message ||
      })
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.playlist = action.payload;
        state.loading = false;
      })
      .addCase(createPlaylist.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to create playlist';
      })
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.playlist = action.payload;
        state.loading = false;
      })
      .addCase(updatePlaylist.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to update playlist';
      })
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = state.playlists
          ? state.playlists.filter((playlist) => playlist.id !== action.payload)
          : null;
        console.log(state.playlists, action);
      })
      .addCase(deletePlaylist.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to delete playlist';
      });
  },
});

export default selectedPlaylistSlice.reducer;

export const { clearSelectedPlaylist } = selectedPlaylistSlice.actions;
