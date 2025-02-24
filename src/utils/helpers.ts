import { MonthAR, MonthFR, MonthGB } from './constants';

export const removeKey = (object: any, key: string) => {
  return object.map((row: any) => {
    const { [key]: removedKey, ...rest } = row;

    return rest;
  });
};

export const formatDuration = (seconds: string) => {
  const minutes = Math.floor(Number(seconds) / 60);
  const secs = Math.floor(Number(seconds) % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export const formatDate = (date: Date, locale: string) => {
  const newDate = date.toString().split('T')[0].split('-');
  console.log('date', date);

  const day = newDate[2];
  const month =
    locale === 'fr'
      ? getMonthFR(Number(newDate[1]))
      : locale === 'ar'
        ? getMonthAR(Number(newDate[1]))
        : getMonth(Number(newDate[1]));
  const year = newDate[0];
  return day + ' ' + month + ' ' + year;
};

export const getMonthFR = (month: number) => {
  return MonthFR[month];
};

export const getMonthAR = (month: number) => {
  return MonthAR[month];
};

export const getMonth = (month: number) => {
  return MonthGB[month];
};
