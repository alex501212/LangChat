import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import Dashboard from "./Dashboard";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer.create(<Dashboard />).toJSON();
  expect(container).toMatchSnapshot();
});
