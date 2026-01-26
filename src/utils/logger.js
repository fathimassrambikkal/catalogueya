export const log = import.meta.env.DEV
  ? (...args) => console.log(...args)
  : () => {};

export const warn = import.meta.env.DEV
  ? (...args) => console.warn(...args)
  : () => {};

export const error = import.meta.env.DEV
  ? (...args) => console.error(...args)
  : () => {};
