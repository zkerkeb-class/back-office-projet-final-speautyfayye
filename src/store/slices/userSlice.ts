import { API_ROUTES } from '@/utils/constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Playlist } from './playlistSlice';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  playlists?: Playlist[];
}

export type UserWithoutPassword = Omit<User, 'password'>; // User without password
export type UserUpdate = Omit<User, 'id'>; // User update
export type UserLogin = Pick<User, 'username' | 'password'>; // User login

interface SelectedUserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  playlists: Playlist[] | null;
}

// État initial
const initialState: SelectedUserState = {
  user: null,
  loading: false,
  error: null,
  playlists: null,
};

// Thunk pour récupérer les Playlists d'un utilisateur depuis une API
export const fetchUserPlaylists = createAsyncThunk(
  'user/fetchUserPlaylists',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}user/playlists/${userId}`); // Appel API
      if (!response.ok) {
        throw new Error('Failed to fetch user playlists');
      }
      const data = await response.json();
      console.log('🚀 ~ data:', data.data);

      return data.data as Playlist[]; // Retourne les Playlists de l'utilisateur
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Slice pour les utilisateurs
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.USER}${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();

      return data.data as User;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const selectedUserSlice = createSlice({
  name: 'selectedUser',
  initialState,
  reducers: {
    // Action pour réinitialiser l'état
    clearSelectedUser(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.playlists = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch playlists from user';
      });
  },
});

export default selectedUserSlice.reducer;

export const { clearSelectedUser } = selectedUserSlice.actions;
