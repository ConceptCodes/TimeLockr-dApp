import { format } from "date-fns";
import { FC } from "react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib";
import { Skeleton } from "./ui/skeleton";

interface IMessageProps {
  messageId: string;
  message: string;
  timestamp: number;
  isLoading?: boolean;
  index: number;
}

const Message: FC<IMessageProps> = (props: IMessageProps) => {
  const getColor = (index: number) => {
    const colors = ["teal", "purple", "orange", "green", "blue"];

    const borders = colors.map((color) => `border-${color}-300`);
    const text = colors.map((color) => `text-${color}-500`);

    return {
      border: borders[index % borders.length] || borders[0],
      text: text[index % text.length] || text[0],
    };
  };

  const { border, text } = getColor(props.index);

  return (
    <Card className={cn(border, "p-5 border-4")}>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <ChatBubbleIcon className={cn(text, "w-5 h-5")} />
          <h3 className="text-muted-foreground font-bold">
            {props.isLoading ? (
              <Skeleton className="w-12 h-4" />
            ) : (
              format(new Date(props.timestamp * 1000), "MM/dd/yyyy")
            )}
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl truncate w-max-[300px]">
          {props.isLoading ? <Skeleton className="w-48 h-4" /> : props.message}
        </CardTitle>
      </CardContent>
      <CardFooter className="font-bold text-xs flex w-full">
        Message Id:{" "}
        <span className="text-muted-foreground ml-2">
          {props.isLoading ? (
            <Skeleton className="w-12 h-4" />
          ) : (
            props.messageId
          )}
        </span>
      </CardFooter>
    </Card>
  );
};

export default Message;
