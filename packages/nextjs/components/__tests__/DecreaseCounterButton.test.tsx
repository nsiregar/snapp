import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DecreaseCounterButton } from "../DecreaseCounterButton";
import * as CounterContext from "~~/context/CounterContext";

const sendAsyncMock = vi.fn();

vi.mock("~~/hooks/scaffold-stark/useScaffoldWriteContract", () => ({
  useScaffoldWriteContract: () => ({
    sendAsync: sendAsyncMock,
    status: "idle",
  }),
}));

describe("DecreaseCounterButton", () => {
  it("renders the button and calls sendAsync on click", () => {
    vi.spyOn(CounterContext, "useCounter").mockReturnValue({
      counter: 1n,
      isCounterLoading: false,
      counterError: null,
      owner: "0x123",
      isOwnerLoading: false,
      ownerError: null,
      address: "0x123",
    });

    render(<DecreaseCounterButton />);

    const button = screen.getByText("-1");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(sendAsyncMock).toHaveBeenCalled();
  });

  it("disables the button when counter is 0", () => {
    vi.spyOn(CounterContext, "useCounter").mockReturnValue({
      counter: 0n,
      isCounterLoading: false,
      counterError: null,
      owner: "0x123",
      isOwnerLoading: false,
      ownerError: null,
      address: "0x123",
    });

    render(<DecreaseCounterButton />);

    const button = screen.getByText("-1");
    expect(button).toBeDisabled();
  });
});
