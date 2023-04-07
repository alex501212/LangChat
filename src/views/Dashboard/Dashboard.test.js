import { cleanup, render, screen, waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";

afterEach(() => {
  cleanup();
});

it("matches snapshot", () => {
  const container = renderer.create(<Dashboard />).toJSON();
  expect(container).toMatchSnapshot();
});

it("renders all text", () => {
  const view = render(<Dashboard />);
  expect(screen.getByText("User Information")).toBeInTheDocument()
  expect(screen.getByText("Forename:")).toBeInTheDocument()
  expect(screen.getByText("Surname:")).toBeInTheDocument()
  expect(screen.getByText("Age:")).toBeInTheDocument()
  expect(screen.getByText("Gender:")).toBeInTheDocument()
  expect(screen.getByText("Email:")).toBeInTheDocument()
  expect(screen.getByText("Username:")).toBeInTheDocument()
  expect(screen.getByText("Native Language:")).toBeInTheDocument()
  expect(screen.getByText("Target Language:")).toBeInTheDocument()
  expect(screen.getByText("User Since:")).toBeInTheDocument()
  expect(screen.getByText("Filters")).toBeInTheDocument()
  expect(screen.getByText("Matching you with native speakers")).toBeInTheDocument()
  expect(screen.getByText("Interests")).toBeInTheDocument()
  expect(screen.getByText("Gender")).toBeInTheDocument()
  expect(screen.getByText("Age")).toBeInTheDocument()
  expect(screen.getByText("Start Chatting")).toBeInTheDocument()
});

it("edit modal opens", async () => {
  const view = render(<Dashboard />);
  const button = screen.getByTestId("edit-modal")
  userEvent.click(button);
  await waitFor(() => {
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  })
});
