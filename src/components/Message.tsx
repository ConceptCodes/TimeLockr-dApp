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

import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface IMessageProps {
  messageId: string;
  message: string;
  timestamp: number;
  color: string;
  isLoading?: boolean;
}

const Message: FC<IMessageProps> = (props: IMessageProps) => {
  return (
    <Card className={cn(`border-${props.color}`, "p-5 border-4")}>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <ChatBubbleIcon className={cn(`text-${props.color}`, "w-5 h-5")} />
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
