"use client";

import { CounterProvider, useCounter } from "~~/context/CounterContext";
import { CounterValue } from "~~/components/CounterValue";
import { IncreaseCounterButton } from "~~/components/IncreaseCounterButton";
import { DecreaseCounterButton } from "~~/components/DecreaseCounterButton";
import { ResetCounterButton } from "~~/components/ResetCounterButton";
import { SetCounterForm } from "~~/components/SetCounterForm";
import { CounterChangedEvents } from "~~/components/CounterChangedEvents";

const CounterPage = () => {
  const { counter, isCounterLoading, counterError } = useCounter();

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="text-lg flex items-center gap-3">
        Counter:{" "}
        <CounterValue
          value={counter}
          isLoading={isCounterLoading}
          error={counterError}
        />
        <IncreaseCounterButton />
        <DecreaseCounterButton />
        <ResetCounterButton />
      </div>
      <div className="mt-4">
        <SetCounterForm />
      </div>
      <div className="mt-6 w-full flex justify-center">
        <CounterChangedEvents />
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <CounterProvider>
      <CounterPage />
    </CounterProvider>
  );
};

export default Home;
