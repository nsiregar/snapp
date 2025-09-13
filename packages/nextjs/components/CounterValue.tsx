"use client";

type Props = { value: any; isLoading?: boolean; error?: any };

export const CounterValue = ({ value, isLoading, error }: Props) => {

  if (error) return <span className="text-error"></span>;
  if (isLoading || value === undefined) return <span>...</span>;

  return <span className="font-mono">{String(value)}</span>;

};
