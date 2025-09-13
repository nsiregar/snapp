"use client";

import { useMemo, useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useAccount } from "~~/hooks/useAccount";

export const SetCounterForm = ({ current }: { current: any }) => {

  const [value, setValue] = useState<string>(
    current !== undefined ? String(current) : "0",
  );

  const { sendAsync, status } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "set_counter",
    args: [],
  });

  const { address } = useAccount();
  const { data: owner } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "owner",
  });

  const normalizeToHex = (input: any): string | undefined => {
    if (input === undefined || input === null) return undefined;
    const raw: any = Array.isArray(input) ? input[0] : input;
    const s = String(raw);
    if (s.length === 0) return undefined;

    return s.startsWith("0x") ? s : `0x${BigInt(s).toString(16)}`;
  };

  const addrHex = useMemo(() => normalizeToHex(address), [address]);
  const ownerHex = useMemo(() => normalizeToHex(owner), [owner]);

  const isOwner = useMemo(() => {
    if (!addrHex || !ownerHex) return false;
    try {
      return BigInt(addrHex) === BigInt(ownerHex);
    } catch {
      return false;
    }

  }, [addrHex, ownerHex]);

  const isBusy = status === "pending";
  const parsed = (() => {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || !Number.isInteger(number)) return undefined;
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
          !isOwner ? "Only the owner can set" :
            parsed === undefined ? "Enter a non-negative integer" : undefined}
      >
        {isBusy ? "Setting..." : "Set"}
      </button>
    </form>
  )
};
