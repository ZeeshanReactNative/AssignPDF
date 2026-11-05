// Creates a short unique id, for example "lq3x9k-a8f2d1"
export const createId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;