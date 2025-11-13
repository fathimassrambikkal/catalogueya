import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// Mock i18n so translations don’t break tests
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en", changeLanguage: () => Promise.resolve() },
  }),
}));

beforeAll(() => {
  window.scrollTo = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders Home link in Navbar", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  // Helps debug what’s rendered if test fails
  // screen.debug();

  const homeLink = screen.getByRole("link", { name: /home/i });
  expect(homeLink).toBeInTheDocument();
});
