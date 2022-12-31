import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import Chat from "./Chat";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer.create(<Chat />).toJSON();
  expect(container).toMatchSnapshot();
});
