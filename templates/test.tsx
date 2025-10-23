import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Component from "./Component";

describe("Component", () => {
  it("1. renders correctly with required props", () => {
    render(<Component prop="test" />);

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("2. handles optional props correctly", () => {
    const mockCallback = vi.fn();
    render(<Component prop="test" onAction={mockCallback} />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockCallback).toHaveBeenCalled();
  });

  it("3. applies custom className", () => {
    render(<Component prop="test" className="custom-class" />);

    expect(screen.getByRole("generic")).toHaveClass("custom-class");
  });

  it("4. handles edge cases", () => {
    render(<Component prop="" />);

    expect(screen.getByRole("generic")).toBeInTheDocument();
  });
});
