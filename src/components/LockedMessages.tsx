import Countdown from "react-countdown";
import { StopwatchIcon } from "@radix-ui/react-icons";

import { Progress } from "./ui/progress";
import { Card, CardContent, CardFooter } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import UnlockSVG from "public/unlock.svg";
import { useEffect, useState } from "react";
import { useMessages } from "@/hooks/useMessages";
import { Skeleton } from "./ui/skeleton";

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
  });

  return (
    <figure className="flex space-x-2">
      <div className="text-xs font-bold w-fit">
        {days > 0 ? (
          <span>
            {formatter.format(days)}
            <span className="text-muted-foreground mr-2">d</span>
          </span>
        ) : null}{" "}
        {hours > 0 ? (
          <span>
            {formatter.format(hours)}
            <span className="text-muted-foreground mr-2">h</span>
          </span>
        ) : null}{" "}
        {minutes > 0 ? (
          <span>
            {formatter.format(minutes)}
            <span className="text-muted-foreground mr-2">m</span>
          </span>
        ) : null}{" "}
        {seconds > 0 ? (
          <span>
            {formatter.format(seconds)}
            <span className="text-muted-foreground ">s</span>
          </span>
        ) : null}
      </div>
    </figure>
  );
};

interface ICountDownProps {
  timestamp?: number;
  isLoading?: boolean;
}

const CountDown = (props: ICountDownProps) => {
  const [timeLeftPercentage, setTimeLeftPercentage] = useState(0);

  useEffect(() => {
    if (props.timestamp)
      setTimeLeftPercentage((props.timestamp / props.timestamp) * 100);
  }, [props.timestamp]);

  return (
    <Card className="flex p-4 my-5">
      <div className="flex-col w-full items-center justify-center">
        <CardContent>
          {props.isLoading ? (
            <Skeleton className="w-48 h-4" />
          ) : (
            <Progress
              max={props.timestamp}
              value={timeLeftPercentage}
              className="rounded-none h-4 w-full"
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between pb-0">
          <div className="flex space-x-3 text-sm">
            <h3 className="font-bold">Message Id:</h3>
            <h3 className="text-muted-foreground">
              {props.isLoading ? (
                <Skeleton className="w-24 h-4" />
              ) : (
                "0x1234567890"
              )}
            </h3>
          </div>
          {!props.isLoading && (
            <Countdown date={props.timestamp} renderer={renderer} />
          )}
        </CardFooter>
      </div>
      {timeLeftPercentage === 100 ? (
        <div className="bg-primary p-3 rounded-md items-center flex justify-center">
          <UnlockSVG />
        </div>
      ) : props.isLoading ? (
        <Skeleton className="w-12 h-12" />
      ) : (
        <figure className="bg-primary w-10 h-10 p-3 rounded-md items-center flex justify-center">
          <StopwatchIcon className="w-8 h-8" />
        </figure>
      )}
    </Card>
  );
};

const LockedMessages = () => {
  const { isLoading, lockedMessages } = useMessages();

  return (
    <div className="flex flex-col w-full xl:w-1/2 space-y-5">
      <h1 className="text-4xl text-left font-bold">Progress</h1>
      <ScrollArea className="h-[500px] flex flex-col w-full">
        {isLoading ? (
          new Array(5).fill(0).map((_, i) => <CountDown key={i} isLoading />)
        ) : lockedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl text-center font-bold">
              No Locked Messages
            </h1>
            <h3 className="text-xl text-center font-bold text-muted-foreground">
              Send a message to get started
            </h3>
          </div>
        ) : (
          lockedMessages.map((message) => (
            <CountDown key={message._messageId} timestamp={message._lockTime} />
          ))
        )}
        <ScrollBar orientation="vertical" className="w-1 h-full" />
      </ScrollArea>
    </div>
  );
};

export default LockedMessages;
