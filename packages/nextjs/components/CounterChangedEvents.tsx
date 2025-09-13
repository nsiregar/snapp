"use client";

import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";
import { CounterChangedEvent } from "~~/models/CounterChangedEvent";

export const CounterChangedEvents = () => {
  const { data, isLoading, error } = useScaffoldEventHistory({
    contractName: "CounterContract",
    eventName: "CounterChanged",
    fromBlock: 0n,
    watch: true,
    format: true,
  });

  if (error) return <div className="text-error">failed</div>;

  if (isLoading && (!data || data.length === 0)) return <div>Loading events ...</div>;

  const events = (data || []).map((e: any) => new CounterChangedEvent(e));

  return (
    <div className="w-full max-w-xl">
      <div className="font-semibold mb-2">CounterChanged events</div>
      <ul className="space-y-2">
        {events.map((event, idx) => (
          <li key={`${event.transactionHash}-${idx}`} className="p-2 rounded border">
            <div className="text-sm opacity-70 break-all">tx: {event.transactionHash}</div>
            <div className="text-sm">caller: {event.caller}</div>
            <div className="text-sm">
              {event.reasonString}: {event.oldValue} - {event.newValue}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
