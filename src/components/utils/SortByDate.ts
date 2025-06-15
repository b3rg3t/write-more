export const sortByDate = <T extends Record<string, any>>(
  array: T[],
  key: string
) => {
  const newArray = [...array];

  return newArray.sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);

    return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
  });
};
