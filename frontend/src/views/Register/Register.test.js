import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import Register from "./Register";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer
    .create(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )
    .toJSON();
  expect(container).toMatchSnapshot();
});
