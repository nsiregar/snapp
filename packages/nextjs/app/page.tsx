"use client";

import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { CounterValue } from "~~/components/CounterValue";
import { IncreaseCounterButton } from "~~/components/IncreaseCounterButton";
import { DecreaseCounterButton } from "~~/components/DecreaseCounterButton";
import { ResetCounterButton } from "~~/components/ResetCounterButton";
import { SetCounterForm } from "~~/components/SetCounterForm";
import { CounterChangedEvents } from "~~/components/CounterChangedEvents";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";

const Home = () => {
  const { data, isLoading, error } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "get_counter",
  });

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="text-lg flex items-center gap-3">
        Counter: <CounterValue value={data} isLoading={isLoading} error={error} />
        <IncreaseCounterButton />
        <DecreaseCounterButton counter={data} />
        <ResetCounterButton counter={data} />
      </div>
      <div className="mt-4">
        <SetCounterForm current={data} />
      </div>
      <div className="mt-6 w-full flex justify-center">
        <CounterChangedEvents />
      </div>
    </div>
  );
};

export default Home;
