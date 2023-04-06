import { cleanup, render, screen, waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import Admin from "./Admin";

afterEach(() => {
  cleanup();
});

const mockFn = jest.fn();

it("matches snapshot", () => {
  const container = renderer.create(<Admin />).toJSON();
  expect(container).toMatchSnapshot();
});

it("renders all text", () => {
  const view = render(<Admin />);
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
  expect(screen.getByText("User List")).toBeInTheDocument()
  expect(screen.getByText("Username")).toBeInTheDocument()
  expect(screen.getByText("View All User Reports")).toBeInTheDocument()
  expect(screen.getByText("Back to Dashboard")).toBeInTheDocument()
});

it("report modal opens", async () => {
  const view = render(<Admin />);
  const button = screen.getByText("View All User Reports");
  userEvent.click(button);
  await waitFor(() => {
    expect(screen.getByText("User Reports")).toBeInTheDocument();
  })
});

it("edit modal opens", async () => {
  const view = render(<Admin />);
  const button = screen.getByTestId("edit-modal")
  userEvent.click(button);
  await waitFor(() => {
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  })
});


