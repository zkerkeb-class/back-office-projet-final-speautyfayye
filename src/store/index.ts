import { configureStore } from "@reduxjs/toolkit";
import selectedArtistReducer from './slices/artistSlice';
import selectedPlaylistReducer from './slices/playlistSlice';

export const store = configureStore({
    reducer: {
        selectedArtist: selectedArtistReducer,
        selectedPlaylist: selectedPlaylistReducer

    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;