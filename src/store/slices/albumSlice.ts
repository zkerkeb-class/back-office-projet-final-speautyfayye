import { API_CRUD, API_ROUTES } from '@/utils/constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Album {
  id: number;
  title: string;
  releaseDate: Date;
  category_id: number;
  picture: string | undefined;
}

interface SelectedAlbumState {
  album: Album | null;
  albums: Album[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: SelectedAlbumState = {
  album: null,
  albums: null,
  loading: true,
  error: null,
};

export const fetchAlbum = createAsyncThunk(
  'selectedAlbum/fetchAlbum',
  async (albumId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.ALBUM}${albumId}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch album');
      }
      return (await response.json()) as Album;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchAllAlbums = createAsyncThunk(
  'selectedAlbum/fetchAllAlbums',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.ALBUM}`);
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await response.json();
      console.log('🚀 ~ data.data:', data.data);
      return data.data as Album[];
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createAlbum = createAsyncThunk(
  'selectedAlbum/createAlbum',
  async (newAlbum: Omit<Album, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.ALBUM}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlbum),
      });
      if (!response.ok) {
        throw new Error('Failed to create album');
      }
      const data = await response.json();
      return data.data as Album;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteAlbum = createAsyncThunk(
  'selectedAlbum/deleteAlbum',
  async (albumId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.ALBUM}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete album');
      }
      return albumId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateAlbum = createAsyncThunk(
  'selectedAlbum/updateAlbum',
  async (album: Album, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_CRUD.UPDATE}${API_ROUTES.ALBUM}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(album),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to update album');
      }
      const data = await response.json();
      return data.data as Album;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const selectedAlbumSlice = createSlice({
  name: 'selectedAlbum',
  initialState,
  reducers: {
    clearSelectedAlbum(state) {
      state.album = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbum.fulfilled, (state, action) => {
        state.album = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlbum.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch album';
      })
      .addCase(fetchAllAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAlbums.fulfilled, (state, action) => {
        state.albums = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllAlbums.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch albums';
      })
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.albums = state.albums
          ? state.albums.filter((album) => album.id !== action.payload)
          : null;
        state.loading = false;
      })
      .addCase(deleteAlbum.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to delete album';
      })
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.albums = state.albums ? [...state.albums, action.payload] : [action.payload];
        state.loading = false;
      })
      .addCase(createAlbum.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to create album';
      })
      .addCase(updateAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.albums = state.albums
          ? state.albums.map((album) => (album.id === action.payload.id ? action.payload : album))
          : null;
        state.loading = false;
      })
      .addCase(updateAlbum.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to update album';
      });
  },
});

export default selectedAlbumSlice.reducer;

export const { clearSelectedAlbum } = selectedAlbumSlice.actions;
