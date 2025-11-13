// setupTests.js
import "@testing-library/jest-dom";

// 🧩 Mock i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en", changeLanguage: jest.fn() },
  }),
}));

// 🧩 Mock Framer Motion (optional)
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
    button: ({ children }) => <button>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 🧩 Mock scrollTo and event listeners
beforeAll(() => {
  window.scrollTo = jest.fn();
  window.addEventListener = jest.fn();
  window.removeEventListener = jest.fn();
});

// 🧩 Mock static assets (png, jpg, etc.)
jest.mock("./assets/logo.png", () => "mock-logo.png");
