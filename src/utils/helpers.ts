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
