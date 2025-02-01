export const removeKey = (object: any, key: string) => {
  return object.map((row: any) => {
    const { [key]: removedKey, ...rest } = row;
    return rest;
  });
};
