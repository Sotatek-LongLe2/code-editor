import { render, screen, cleanup } from "@testing-library/react";
import MonacoEditor from "..";

afterEach(() => {
  cleanup();
});

describe("MonacoEditor component", () => {
  test("renders without crashing", () => {
    render(<MonacoEditor />);
  });

  test("toggles file tree on dropdown click", () => {
    render(<MonacoEditor />);
    const dropdownFile = screen.getByText("Add new file");
    expect(dropdownFile).toBeInTheDocument();
  });

  test("changes active tab when clicked", () => {
    render(<MonacoEditor />);
    const tabMainPy = screen.getByTestId("app-main");
    expect(tabMainPy).toHaveClass('monaco-editor')
  });
});
