import Countdown from "react-countdown";
import { StopwatchIcon } from "@radix-ui/react-icons";

import { Progress } from "./ui/progress";
import { Card, CardContent, CardFooter } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import UnlockSVG from "public/unlock.svg";
import { useEffect, useState } from "react";

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

const CountDown = ({ timestamp }: { timestamp: number }) => {
  const [timeLeftPercentage, setTimeLeftPercentage] = useState(0);

  useEffect(() => {
    setTimeLeftPercentage((timestamp / timestamp) * 100);
  }, [timestamp]);

  return (
    <Card className="flex p-4">
      <div className="flex-col w-full items-center justify-center">
        <CardContent>
          <Progress
            max={timestamp}
            value={timeLeftPercentage}
            className="rounded-none h-4 w-full"
          />
        </CardContent>
        <CardFooter className="flex justify-between pb-0">
          <div className="flex space-x-3 text-sm">
            <h3 className="font-bold">Message Id:</h3>
            <h3 className="text-muted-foreground">0x1234567890</h3>
          </div>
          <Countdown date={timestamp} renderer={renderer} />
        </CardFooter>
      </div>
      <figure className="bg-primary w-10 h-10 p-3 rounded-md items-center flex justify-center">
        <StopwatchIcon className="w-8 h-8" />
      </figure>
    </Card>
  );
};

const LockedMessages = (props: any) => {
  return (
    <div className="flex flex-col w-full xl:w-1/2 space-y-5">
      <h1 className="text-4xl text-left font-bold">Progress</h1>
      <ScrollArea className="h-[500px] flex flex-col w-full space-y-5">
        <CountDown timestamp={Date.now() + 1000000} />
      </ScrollArea>
    </div>
  );
};

export default LockedMessages;
