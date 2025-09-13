"use client";

import { useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark/useDeployedContractInfo";
import { strkToFri } from "~~/utils/scaffold-stark/common";
import { useCounter } from "~~/context/CounterContext";

export const ResetCounterButton = () => {
  const { counter } = useCounter();
  const { data: counterContract } = useDeployedContractInfo("CounterContract");

  const { sendAsync, status } = useScaffoldMultiWriteContract({
    calls: [
      {
        contractName: "Strk",
        functionName: "approve",
        args: [counterContract?.address, strkToFri(1)],
      },
      {
        contractName: "CounterContract",
        functionName: "reset_counter",
        args: [],
      },
    ],
  });

  return (
    <button
      className="btn btn-primary btn-sm"
      onClick={() => sendAsync()}
      disabled={status === "pending" || counter === 0n}
    >
      {status === "pending" ? "Resetting..." : "Reset"}
    </button>
  );
};
