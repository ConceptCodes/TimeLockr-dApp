import { format } from "date-fns";
import AddMessage from "./AddMessage";
import Message from "./Message";
import { useMessages } from "@/hooks/useMessages";

const UnlockedMessages = () => {
  const getColor = (index: number): string => {
    const opts = [
      "teal-300",
      "purple-300",
      "orange-300",
      "green-300",
      "blue-300",
    ];
    return opts[index % opts.length] as string;
  };

  const { isLoading, unlockedMessages } = useMessages();

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
        {isLoading &&
          new Array(4)
            .fill(0)
            .map((_, i) => (
              <Message
                key={i}
                messageId="0x1234567890"
                message="This is a test message to see how it looks like."
                timestamp={1681877791 + i * 1000}
                color={getColor(i)}
                isLoading={isLoading}
              />
            ))}
        {unlockedMessages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-4xl font-bold text-center">No messages yet</h1>
            <h2 className="text-xl text-center">
              Start by adding a new message
            </h2>
          </div>
        )}
        {unlockedMessages.map((_, i) => (
          <Message
            key={i}
            messageId="0x1234567890"
            message="This is a test message to see how it looks like."
            timestamp={1681877791 + i * 1000}
            color={getColor(i)}
            isLoading={isLoading}
          />
        ))}
      </div>
    </section>
  );
};

export default UnlockedMessages;
