"use client";

import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";

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

  return (
    <div className="w-full max-w-xl">
      <div className="font-semibold mb-2">CounterChanged events</div>
      <ul className="space-y-2">
        {
          (data || []).map((e: any, idx: number) => {
            const parsed = e.parsedArgs || {};
            const oldVal = parsed.old_value ?? parsed.oldValue ?? "?";
            const newVal = parsed.new_value ?? parsed.newValue ?? "?";
            const reason = parsed.reason ?? parsed.Reason ?? "?";
            const caller = parsed.caller ?? parsed.Caller ?? "?";
            return (
              <li key={`${e.log?.transaction_hash ?? idx}-${idx}`} className="p-2 rounded border">
                <div className="text-sm opacity-70 break-all">tx: {e.log?.transaction_hash ?? "?"}</div>
                <div className="text-sm">caller: {String(caller)}</div>
                <div className="text-sm">{String(reason)}: {String(oldVal)} - {String(newVal)}</div>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};
