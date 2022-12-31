import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import Login from "./Login";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer.create(<Login />).toJSON();
  expect(container).toMatchSnapshot();
});
