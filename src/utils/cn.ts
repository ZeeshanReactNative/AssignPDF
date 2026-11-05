type ClassValue = string | false | null | undefined;

// Classes ko jorta hai aur false/null/undefined hata deta hai.
export const cn = (...classes: ClassValue[]): string =>
  classes.filter(Boolean).join(' ');