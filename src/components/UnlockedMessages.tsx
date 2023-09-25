import { format } from "date-fns";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

import AddMessage from "./AddMessage";
import Message from "./Message";

import { useMessages } from "@/hooks/useMessages";

const UnlockedMessages = () => {
  const { loading, unlockedMessages } = useMessages();

  return (
    <section className="flex flex-col w-full py-20 space-y-5">
      <h1 className="text-8xl text-left  font-bold">Messages</h1>
      <div className="flex w-full flex-row-reverse">
        <h2 className="text-muted-foreground text-lg ">
          {format(new Date(), "MMMM yyyy")}
        </h2>
      </div>
      <div className="flex flex-nowrap space-x-5 overflow-hidden overflow-x-scroll">
        <AddMessage />
        {loading &&
          new Array(4)
            .fill(0)
            .map((_, i) => (
              <Message
                key={i}
                messageId="0x1234567890"
                message="This is a test message to see how it looks like."
                timestamp={1681877791 + i * 1000}
                index={i}
                isLoading={loading}
              />
            ))}
        {unlockedMessages.length === 0 && !loading && (
          <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
            <ChatBubbleIcon className="h-16 w-16 text-muted-foreground/60 dark:text-muted" />
            <h2 className="text-xl font-bold">No Messages</h2>
            <p className="max-w-sm text-center text-base text-muted-foreground">
              No messages were found. Try adding a new message.
            </p>
          </div>
        )}
        {unlockedMessages.map((msg, i) => (
          <Message
            key={i}
            messageId={msg._messageId}
            message={msg._user}
            timestamp={msg._timestamp}
            index={i}
            isLoading={loading}
          />
        ))}
      </div>
    </section>
  );
};

export default UnlockedMessages;
