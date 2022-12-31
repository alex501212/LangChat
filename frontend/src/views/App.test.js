import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import App from "./App";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer.create(<App />).toJSON();
  expect(container).toMatchSnapshot();
});
