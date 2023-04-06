import { cleanup, render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer
    .create(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    .toJSON();
  expect(container).toMatchSnapshot();
});

it("renders all text", () => {
  const view = render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  expect(screen.getByText("Welcome to LangChat")).toBeInTheDocument();
  expect(screen.getByText("Login")).toBeInTheDocument();
  expect(screen.getByText("Register")).toBeInTheDocument();
});
