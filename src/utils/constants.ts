export const API_ROUTES = {
  AUTH: 'auth/',
  FILE: 'file/',
  AUDIO: 'audio/',
  USER: 'user/',
  PLAYLIST: 'playlist/',
  TRACK: 'track/',
  ARTIST: 'artist/',
  ALBUM: 'album/',
  CATEGORY: 'category/',
};

export const API_CRUD = {
  CREATE: 'create/',
  UPDATE: 'update/',
  DELETE: 'delete/',
};

export enum MonthGB {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11,
}

export enum MonthFR {
  Janvier = 0,
  Février = 1,
  Mars = 2,
  Avril = 3,
  Mai = 4,
  Juin = 5,
  Juillet = 6,
  Août = 7,
  Septembre = 8,
  Octobre = 9,
  Novembre = 10,
  Décembre = 11,
}

export enum MonthAR {
  يناير = 0,
  فبراير = 1,
  مارس = 2,
  أبريل = 3,
  مايو = 4,
  يونيو = 5,
  يوليوز = 6,
  غشت = 7,
  شتنبر = 8,
  أكتوبر = 9,
  نونبر = 10,
  دجنبر = 11,
}

export const supportedLocales = ['fr', 'gb', 'ar'];
export const defaultLocale = 'gb';
