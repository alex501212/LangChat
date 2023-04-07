import { cleanup, render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import Login from "./Login";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer.create(<Login />).toJSON();
  expect(container).toMatchSnapshot();
});

it("renders all text", () => {
  const view = render(<Login />);
  expect(screen.getByText("Log in to LangChat")).toBeInTheDocument();
  expect(screen.getByText("Show")).toBeInTheDocument();
  expect(screen.getByText("Login")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
});
