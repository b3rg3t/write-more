export const isValidDate = (date: Date): boolean =>
  date instanceof Date && !Number.isNaN(date.getTime());

export const parseDateOnlyString = (
  value?: string | null,
): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const parts = value.split("-");
  if (parts.length !== 3) {
    return undefined;
  }

  const [year, month, day] = parts.map(Number);
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

export const parseOptionalDate = (value?: unknown): Date | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (value instanceof Date) {
    return isValidDate(value) ? value : undefined;
  }

  const stringValue = String(value).trim();
  if (!stringValue) {
    return undefined;
  }

  const strictDate = parseDateOnlyString(stringValue);
  if (strictDate) {
    return strictDate;
  }

  const parsed = new Date(stringValue);
  return isValidDate(parsed) ? parsed : undefined;
};
