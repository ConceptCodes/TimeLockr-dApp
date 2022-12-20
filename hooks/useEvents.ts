import { useEffect, useState } from "react";
import { useSDK } from "@thirdweb-dev/react";

export interface IEvent {
  address?: string | any;
  messageId?: string | any;
  oldFee?: number;
  fee?: number;
  oldTime?: number;
  minimumLockUpTime?: number;
  timestamp: number;
  type?:
    | "MessageLocked"
    | "MessageUnlocked"
    | "FeeUpdated"
    | "MinimumLockUpTimeUpdated"
    | "AddedToWhitelist"
    | "RemovedFromWhitelist";
  isError?: boolean;
  errorType?:
    | "InsufficientFunds"
    | "InvalidLockTime"
    | "MessageStillLocked"
    | "EmptyMessage";
  amount?: number;
  timeLocked?: number;
}

export function useEvents() {
  const [events, setEvents] = useState<IEvent[]>();
  const [loading, setLoading] = useState(true);

  const sdk = useSDK();

  const init = async () => {
    const contract = await sdk?.getContract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string
    );

    contract?.events.getAllEvents().then((events) => {
      setLoading(false);

      events.forEach((event) => {
        setEvents((prevState: any) => [
          ...prevState,
          {
            ...event.data,
            type: event.eventName,
          },
        ]);
      });
    });
  };

  useEffect(() => {
    return () => {
      init();
    };
  }, []);

  return { events, loading };
}
