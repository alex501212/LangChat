import { cleanup, render, screen } from "@testing-library/react";
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

it("renders all text", () => {
  const view = render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
  expect(screen.getByText("Sign up for LangChat")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Forename")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Surname")).toBeInTheDocument();
  expect(screen.getByText("Age")).toBeInTheDocument();
  expect(screen.getByText("Gender")).toBeInTheDocument();
  expect(screen.getByText("Select a Gender")).toBeInTheDocument();
  expect(screen.getByText("Male")).toBeInTheDocument();
  expect(screen.getByText("Female")).toBeInTheDocument();
  expect(screen.getByText("Other")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByText("Show")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  expect(screen.getByText("What is your native language?")).toBeInTheDocument();
  expect(
    screen.getByText("What language are you learning?")
  ).toBeInTheDocument();
  expect(screen.getByText("Upload Profile Picture")).toBeInTheDocument();
  expect(screen.getByText("Register")).toBeInTheDocument();
});
