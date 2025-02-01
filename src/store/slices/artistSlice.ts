import { API_CRUD, API_ROUTES } from '@/utils/constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Artist {
  id: number;
  name: string;
  category_id: number;
  bio: string;
  picture: string | undefined;
}

interface SelectedArtistState {
  artist: Artist | null;
  artists: Artist[] | null;
  loading: boolean;
  error: string | null;
}

// État initial
const initialState: SelectedArtistState = {
  artist: null,
  artists: null,
  loading: true,
  error: null,
};

// Thunk pour récupérer un artiste depuis une API
export const fetchArtist = createAsyncThunk(
  'selectedArtist/fetchArtist',
  async (artistId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.ARTIST}${artistId}`,
      ); // TODO: A finir quand API prête
      if (!response.ok) {
        throw new Error('Failed to fetch artist');
      }
      return (await response.json()) as Artist; // Retourne l'artiste
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchAllArtists = createAsyncThunk(
  'selectedArtist/fetchAllArtists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.ARTIST}`); // TODO: A finir quand API prête
      if (!response.ok) {
        throw new Error('Failed to fetch artists');
      }
      const data = await response.json();
      console.log('🚀 ~ data:', data);

      return data.data as Artist[]; // Retourne la liste des artistes
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createArtist = createAsyncThunk(
  'selectedArtist/createArtist',
  async (newArtist: Omit<Artist, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.ARTIST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArtist),
      }); // Appel API
      if (!response.ok) {
        throw new Error('Failed to create Artist');
      }
      const data = await response.json();
      return data.data as Artist; // Retourne la nouvelle Playlist
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteArtist = createAsyncThunk(
  'selectedArtist/deleteArtist',
  async (artistId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.ARTIST}`, {
        method: 'DELETE',
      }); // TODO: A finir quand API prête
      if (!response.ok) {
        throw new Error('Failed to delete artist');
      }
      return artistId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateArtist = createAsyncThunk(
  'selectedArtist/updateArtist',
  async (artist: Artist, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_CRUD.UPDATE}${API_ROUTES.ARTIST}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(artist),
        },
      ); // Appel API
      if (!response.ok) {
        throw new Error('Failed to update artist');
      }
      const data = await response.json();
      return data.data as Artist; // Retourne l'artiste mis à jour
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const selectedArtistSlice = createSlice({
  name: 'selectedArtist',
  initialState,
  reducers: {
    clearSelectedArtist(state) {
      state.artist = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtist.fulfilled, (state, action) => {
        state.artist = action.payload;
        state.loading = false;
      })
      .addCase(fetchArtist.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch artist';
      })
      .addCase(fetchAllArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllArtists.fulfilled, (state, action) => {
        state.artists = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllArtists.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch artists';
      })
      .addCase(deleteArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArtist.fulfilled, (state, action) => {
        state.artists = state.artists
          ? state.artists.filter((artist) => artist.id !== action.payload)
          : null;
        state.loading = false;
      })
      .addCase(deleteArtist.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to delete artist';
      })
      .addCase(createArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArtist.fulfilled, (state, action) => {
        state.artists = state.artists ? [...state.artists, action.payload] : [action.payload];
        state.loading = false;
      })
      .addCase(createArtist.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to create artist';
      })
      .addCase(updateArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtist.fulfilled, (state, action) => {
        state.artists = state.artists
          ? state.artists.map((artist) =>
              artist.id === action.payload.id ? action.payload : artist,
            )
          : null;
        state.loading = false;
      })
      .addCase(updateArtist.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to update artist';
      });
  },
});

export default selectedArtistSlice.reducer;

export const { clearSelectedArtist } = selectedArtistSlice.actions;
