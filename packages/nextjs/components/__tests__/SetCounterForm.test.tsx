import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SetCounterForm } from "../SetCounterForm";
import * as CounterContext from "~~/context/CounterContext";

const sendAsyncMock = vi.fn();

vi.mock("~~/hooks/scaffold-stark/useScaffoldWriteContract", () => ({
  useScaffoldWriteContract: () => ({
    sendAsync: sendAsyncMock,
    status: "idle",
  }),
}));

describe("SetCounterForm", () => {
  it("renders the form and calls sendAsync on submit", () => {
    vi.spyOn(CounterContext, "useCounter").mockReturnValue({
      counter: 1n,
      isCounterLoading: false,
      counterError: null,
      owner: 0x123n,
      isOwnerLoading: false,
      ownerError: null,
      address: "0x123",
    });

    render(<SetCounterForm />);

    const input = screen.getByRole("spinbutton");
    expect(input).toBeInTheDocument();

    const button = screen.getByText("Set");
    expect(button).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "42" } });
    fireEvent.click(button);

    expect(sendAsyncMock).toHaveBeenCalledWith({ args: [42] });
  });

  it("disables the button when not owner", () => {
    vi.spyOn(CounterContext, "useCounter").mockReturnValue({
      counter: 1n,
      isCounterLoading: false,
      counterError: null,
      owner: 0x456n,
      isOwnerLoading: false,
      ownerError: null,
      address: "0x123",
    });

    render(<SetCounterForm />);

    const button = screen.getByText("Set");
    expect(button).toBeDisabled();
  });
});
