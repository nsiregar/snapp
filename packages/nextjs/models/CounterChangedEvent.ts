type Reason = {
  variant: Record<string, any>;
};

export class CounterChangedEvent {
  public readonly transactionHash: string;
  public readonly caller: string;
  public readonly oldValue: string;
  public readonly newValue: string;
  public readonly reasonString: string;

  constructor(event: any) {
    const parsed = event.parsedArgs || {};
    this.transactionHash = event.log?.transaction_hash ?? "?";
    this.caller = String(parsed.caller ?? parsed.Caller ?? "?");
    this.oldValue = String(parsed.old_value ?? parsed.oldValue ?? "?");
    this.newValue = String(parsed.new_value ?? parsed.newValue ?? "?");
    this.reasonString = this.getActiveVariant(parsed.reason ?? parsed.Reason ?? {});
  }

  private getActiveVariant(reason: Reason): string {
    const variant = reason.variant;
    if (!variant) {
      return "?";
    }
    const keys = Object.keys(variant);

    if (keys.length === 0) {
      return "?";
    } else if (keys.length === 1) {
      return keys[0];
    } else {
      return keys.find(k => variant[k]) ?? "?";
    }
  }
}
