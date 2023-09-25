import { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { env } from "@/env.mjs";
import useThirdWeb from "./useThirdWeb";

export interface IEvent {
  _user?: string;
  _messageId?: string;
  _oldFee?: number;
  _fee?: number;
  _prevLockTime?: number;
  _lockTime?: number;
  _timestamp?: number;
  newOwner?: string;
  previousOwner?: string;
  type:
    | "MessageLocked"
    | "MessageUnlocked"
    | "FeeUpdated"
    | "MinimumLockUpTimeUpdated"
    | "AddedToWhitelist"
    | "OwnershipTransferred"
    | "RemovedFromWhitelist";
}

export function useEvents() {
  const [events, setEvents] = useState<IEvent[]>();
  const { contract, loading } = useThirdWeb();

  useEffect(() => {
    const fetchEvents = async () => {
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
  }, [contract]);

  return { events, loading };
}
