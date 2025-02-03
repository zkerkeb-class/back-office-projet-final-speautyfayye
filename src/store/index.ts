import { configureStore } from '@reduxjs/toolkit';
import selectedAlbumReducer from './slices/albumSlice';
import selectedArtistReducer from './slices/artistSlice';
import selectedCategoryReducer from './slices/categorySlice';
import selectedPlaylistReducer from './slices/playlistSlice';
import selectedTrackReducer from './slices/trackSlice';
import selectedUserReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    selectedArtist: selectedArtistReducer,
    selectedPlaylist: selectedPlaylistReducer,
    selectedUser: selectedUserReducer,
    selectedAlbum: selectedAlbumReducer,
    selectedCategory: selectedCategoryReducer,
    selectedTrack: selectedTrackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
