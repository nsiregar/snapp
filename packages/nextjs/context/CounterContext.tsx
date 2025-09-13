"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAccount } from "@starknet-react/core";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";

interface CounterContextType {
  counter: any;
  isCounterLoading: boolean;
  counterError: Error | null;
  owner: any;
  isOwnerLoading: boolean;
  ownerError: Error | null;
  address: `0x${string}` | undefined;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();

  const {
    data: counter,
    isLoading: isCounterLoading,
    error: counterError,
  } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "get_counter",
  });

  const {
    data: owner,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "owner",
  });

  return (
    <CounterContext.Provider
      value={{
        counter,
        isCounterLoading,
        counterError,
        owner,
        isOwnerLoading,
        ownerError,
        address,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
};
