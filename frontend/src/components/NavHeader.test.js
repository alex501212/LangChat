import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import NavHeader from "./NavHeader";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer.create(<NavHeader />).toJSON();
  expect(container).toMatchSnapshot();
});
