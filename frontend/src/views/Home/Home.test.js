import { cleanup } from "@testing-library/react";
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
