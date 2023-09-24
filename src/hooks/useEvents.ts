import { useEffect, useState } from "react";
import { useSDK } from "@thirdweb-dev/react";

export interface IEvent {
  _user?: string;
  _messageId?: string;
  _oldFee?: number;
  _fee?: number;
  _prevLockTime?: number;
  _lockTime?: number;
  _timestamp?: number;
  type:
    | "MessageLocked"
    | "MessageUnlocked"
    | "FeeUpdated"
    | "MinimumLockUpTimeUpdated"
    | "AddedToWhitelist"
    | "RemovedFromWhitelist";
}

export function useEvents() {
  const [events, setEvents] = useState<IEvent[]>();

  const sdk = useSDK();

  useEffect(() => {
    const fetchEvents = async () => {
      const contract = await sdk?.getContract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string
      );
      const _events = await contract?.events.getAllEvents();
      const clean = _events?.map((event) => {
        return {
          ...event.data,
          _timestamp: event?.data?._timestamp,
          type: event.eventName,
        } as IEvent;
      });
      setEvents(clean);
    };
    fetchEvents();
  }, [sdk]);

  return { events };
}
