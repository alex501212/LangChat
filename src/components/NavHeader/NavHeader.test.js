import { cleanup, render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import NavHeader from "./NavHeader";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer.create(<NavHeader />).toJSON();
  expect(container).toMatchSnapshot();
});

it("renders heading", () => {
  const view = render(<NavHeader />);
  screen.getByText("LangChat");
})