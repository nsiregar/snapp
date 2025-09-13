import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { IncreaseCounterButton } from "../IncreaseCounterButton";

const sendAsyncMock = vi.fn();

vi.mock("~~/hooks/scaffold-stark/useScaffoldWriteContract", () => ({
  useScaffoldWriteContract: () => ({
    sendAsync: sendAsyncMock,
    status: "idle",
  }),
}));

describe("IncreaseCounterButton", () => {
  it("renders the button and calls sendAsync on click", () => {
    render(<IncreaseCounterButton />);

    const button = screen.getByText("+1");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(sendAsyncMock).toHaveBeenCalled();
  });
});
