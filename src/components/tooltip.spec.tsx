import { render, screen, fireEvent } from "@testing-library/react";
import { Tooltip } from "./tooltip";

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Trigger</button>
      </Tooltip>
    );
    
    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("shows tooltip on hover", () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Trigger</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText("Trigger").parentElement;
    fireEvent.mouseEnter(trigger!);
    
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });

  it("hides tooltip on mouse leave", () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Trigger</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText("Trigger").parentElement;
    fireEvent.mouseEnter(trigger!);
    fireEvent.mouseLeave(trigger!);
    
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("does not show tooltip when disabled", () => {
    render(
      <Tooltip content="Tooltip content" disabled>
        <button>Trigger</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText("Trigger").parentElement;
    fireEvent.mouseEnter(trigger!);
    
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });
});
