import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import Admin from "./Admin";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer.create(<Admin />).toJSON();
  expect(container).toMatchSnapshot();
});
