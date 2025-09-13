"use client";

import { useMemo, useState, useEffect } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useCounter } from "~~/context/CounterContext";

export const SetCounterForm = () => {
  const { counter, address, owner } = useCounter();
  const [value, setValue] = useState<string>("0");

  useEffect(() => {
    if (counter !== undefined) {
      setValue(String(counter));
    }
  }, [counter]);

  const { sendAsync, status } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "set_counter",
    args: [0],
  });

  const isOwner = useMemo(() => {
    if (!address || owner === undefined) return false;
    try {
      return BigInt(address) === owner;
    } catch {
      return false;
    }
  }, [address, owner]);

  const isBusy = status === "pending";
  const parsed = (() => {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || !Number.isInteger(number))
      return undefined;
    return number;
  })();

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (parsed === undefined) return;
        sendAsync({ args: [parsed] });
      }}
    >
      <input
        className="input input-bordered input-sm w-24"
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="btn btn-accent btn-sm"
        type="submit"
        disabled={isBusy || parsed === undefined || !isOwner}
        title={
          !isOwner
            ? "Only the owner can set"
            : parsed === undefined
            ? "Enter a non-negative integer"
            : undefined
        }
      >
        {isBusy ? "Setting..." : "Set"}
      </button>
    </form>
  );
};
