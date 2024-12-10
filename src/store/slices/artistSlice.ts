import { API_ROUTES } from "@/utils/constants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { env } from "process";

interface Artist {
  id: number;
  name: string;
  category_id: number;
  bio: string;
  picture: string | undefined;
}

interface SelectedArtistState {
  artist: Artist | null;
  loading: boolean;
  error: string | null;
}

// État initial
const initialState: SelectedArtistState = {
  artist: null,
  loading: true,
  error: null,
};

// Thunk pour récupérer un artiste depuis une API
export const fetchArtist = createAsyncThunk(
  'selectedArtist/fetchArtist',
  async (artistId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${env.URL_API}`); // TODO: A finir quand API prête
      if (!response.ok) {
        throw new Error('Failed to fetch artist');
      }
      return (await response.json()) as Artist; // Retourne l'artiste
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const selectedArtistSlice = createSlice({
  name: 'selectedArtist',
  initialState,
  reducers: {
    // Action pour réinitialiser l'état
    clearSelectedArtist(state) {
      state.artist = null;
      state.loading = false;
      state.error = null;
    }
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
      .addCase(fetchArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch artist';
      });
  }
});

export default selectedArtistSlice.reducer;

export const { clearSelectedArtist } = selectedArtistSlice.actions;