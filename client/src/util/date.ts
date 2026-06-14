export const isValidDate = (date: Date): boolean =>
  date instanceof Date && !Number.isNaN(date.getTime());

export const formatDateToInputValue = (value?: Date | string | null) => {
  if (!value) {
    return "";
  }

  const date =
    typeof value === "string"
      ? parseDateOnlyString(value)
      : new Date(value.getFullYear(), value.getMonth(), value.getDate());

  if (!date || !isValidDate(date)) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDateOnlyString = (value: string): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);
  if (!isValidDate(date)) {
    return undefined;
  }

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
};
