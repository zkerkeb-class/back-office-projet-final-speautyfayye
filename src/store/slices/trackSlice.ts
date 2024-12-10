export interface Track {
    id: number;
    title: string;
    duration: string;
    releaseDate: Date;
    trackNumber: number;
    album_id: number;
    category_id: number;
    picture: string | undefined;
  }