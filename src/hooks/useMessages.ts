import { useSDK } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const address = useAddress();
  const sdk = useSDK();

  useEffect(() => {
    // const fetchMessages = async () => {
    //   const contract = await sdk?.getContract(
    //     process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string
    //   );
    //   const _events = await contract?.events.getAllEvents();
    //   const clean = _events
    //     ?.filter((event) => {
    //       (event.eventName === "MessageLocked" ||
    //         event.eventName === "MessageUnlocked") &&
    //         event.data._user === address;
    //     })
    //     .map((event) => {
    //       return {
    //         ...event.data,
    //         _timestamp: event?.data?._timestamp,
    //         type: event.eventName,
    //       } as IMessage;
    //     });
    //   setLockedMessages(
    //     clean?.filter((message) => message.type === "MessageLocked")
    //   );
    //   setUnlockedMessages(
    //     clean?.filter((message) => message.type === "MessageUnlocked")
    //   );
    //   setIsLoading(false);
    // };
    // fetchMessages();
  }, [sdk, address]);

  return { lockedMessages, unlockedMessages, isLoading };
}
