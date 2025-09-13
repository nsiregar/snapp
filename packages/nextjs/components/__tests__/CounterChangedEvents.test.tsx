import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, type Mock } from "vitest";
import { CounterChangedEvents } from "~~/components/CounterChangedEvents";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";
import { CounterChangedEvent } from "~~/models/CounterChangedEvent";

vi.mock("~~/hooks/scaffold-stark/useScaffoldEventHistory");

const mockUseScaffoldEventHistory = useScaffoldEventHistory as Mock;

describe("CounterChangedEvents", () => {
  it("renders loading state correctly", () => {
    mockUseScaffoldEventHistory.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    render(<CounterChangedEvents />);
    expect(screen.getByText("Loading events ...")).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    mockUseScaffoldEventHistory.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("Failed to fetch events"),
    });

    render(<CounterChangedEvents />);
    expect(screen.getByText("failed")).toBeInTheDocument();
  });

  it("renders events correctly with different reasons", () => {
    const mockEvents = [
      {
        log: { transaction_hash: "0x1" },
        parsedArgs: {
          old_value: 10,
          new_value: 11,
          caller: "0xcaller1",
          reason: { variant: { Increase: {} } },
        },
      },
      {
        log: { transaction_hash: "0x2" },
        parsedArgs: {
          old_value: 11,
          new_value: 10,
          caller: "0xcaller2",
          reason: { variant: { Decrease: {} } },
        },
      },
      {
        log: { transaction_hash: "0x3" },
        parsedArgs: {
          old_value: 10,
          new_value: 0,
          caller: "0xcaller3",
          reason: { variant: { Reset: {} } },
        },
      },
      {
        log: { transaction_hash: "0x4" },
        parsedArgs: {
          old_value: 0,
          new_value: 42,
          caller: "0xcaller4",
          reason: { variant: { Set: {} } },
        },
      },
      {
        log: { transaction_hash: "0x5" },
        parsedArgs: {
          old_value: 42,
          new_value: 43,
          caller: "0xcaller5",
          reason: {}, // Malformed reason
        },
      },
    ];

    mockUseScaffoldEventHistory.mockReturnValue({
      data: mockEvents,
      isLoading: false,
      error: null,
    });

    render(<CounterChangedEvents />);

    const eventItems = mockEvents.map(e => new CounterChangedEvent(e));

    expect(screen.getByText(`${eventItems[0].reasonString}: ${eventItems[0].oldValue} - ${eventItems[0].newValue}`)).toBeInTheDocument();
    expect(screen.getByText(`${eventItems[1].reasonString}: ${eventItems[1].oldValue} - ${eventItems[1].newValue}`)).toBeInTheDocument();
    expect(screen.getByText(`${eventItems[2].reasonString}: ${eventItems[2].oldValue} - ${eventItems[2].newValue}`)).toBeInTheDocument();
    expect(screen.getByText(`${eventItems[3].reasonString}: ${eventItems[3].oldValue} - ${eventItems[3].newValue}`)).toBeInTheDocument();
    expect(screen.getByText(`${eventItems[4].reasonString}: ${eventItems[4].oldValue} - ${eventItems[4].newValue}`)).toBeInTheDocument();
  });
});
