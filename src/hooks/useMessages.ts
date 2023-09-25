import { useSDK } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import useThirdWeb from "./useThirdWeb";

interface IMessage {
  _messageId: string;
  _user: string;
  _fee: number;
  _lockTime: number;
  _timestamp: number;
  type: "MessageLocked" | "MessageUnlocked";
}

export function useMessages() {
  const [lockedMessages, setLockedMessages] = useState<IMessage[]>([]);
  const [unlockedMessages, setUnlockedMessages] = useState<IMessage[]>([]);
  const address = useAddress();
  const { contract, loading } = useThirdWeb();

  useEffect(() => {
    const fetchMessages = async () => {
      const _events = await contract?.events.getAllEvents();
      const clean = _events
        ?.filter((event) => {
          return (
            (event.eventName === "MessageLocked" ||
              event.eventName === "MessageUnlocked") &&
            event.data._user === address
          );
        })
        .map((event) => {
          return {
            ...event.data,
            _timestamp: event?.data?._timestamp,
            type: event.eventName,
          } as IMessage;
        });
      if (clean) {
        setLockedMessages((prev) =>
          prev.concat(
            clean?.filter((message) => message.type === "MessageLocked")
          )
        );
        setUnlockedMessages((prev) =>
          prev.concat(
            clean?.filter((message) => message.type === "MessageUnlocked")
          )
        );
      }
    };
    fetchMessages();
  }, [contract, address]);

  return { lockedMessages, unlockedMessages, loading };
}
