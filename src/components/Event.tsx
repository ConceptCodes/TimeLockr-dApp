import { FC } from "react";
import {
  LapTimerIcon,
  LockOpen2Icon,
  MagicWandIcon,
  MixerVerticalIcon,
  PersonIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";

import ArrowSVG from "public/arrow.svg";
import FeeSVG from "public/fee.svg";
import LockSVG from "public/lock.svg";
import UnlockSVG from "public/unlock.svg";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

import { IEvent } from "@/hooks/useEvents";
import { formatAddress } from "@/lib";
import { cn } from "@/lib";

interface IEventProps {
  event: IEvent | null;
  isLoading?: boolean;
}

const Event: FC<IEventProps> = (props: IEventProps) => {
  const cleanEventName = () => {
    return props.event?.type?.split(/(?=[A-Z])/)?.join(" ");
  };

  const iconStyle = (color: string) =>
    `w-10 h-10 rounded-md items-center flex justify-center border-${color}-500/50 border-2`;

  const getIcon = () => {
    switch (props.event?.type) {
      case "MessageUnlocked":
        return (
          <figure className={cn(iconStyle("teal"))}>
            <LockOpen2Icon className="h-10 " />
          </figure>
        );
      case "MessageLocked":
        return (
          <figure className={cn(iconStyle("purple"))}>
            <StopwatchIcon className="h-10 " />
          </figure>
        );
      case "FeeUpdated":
        return (
          <figure className={cn(iconStyle("orange"))}>
            <MixerVerticalIcon className="h-10 " />
          </figure>
        );
      case "MinimumLockUpTimeUpdated":
        return (
          <figure className={cn(iconStyle("yellow"))}>
            <MagicWandIcon className="h-10 " />
          </figure>
        );
      case "OwnershipTransferred":
        return (
          <figure className={cn(iconStyle("blue"))}>
            <PersonIcon className="h-10 " />
          </figure>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-row space-x-10 items-center w-ful p-4 border-none shadow-none">
      <h3 className="text-muted-foreground">
        {props.isLoading ? "05: 15 am" : format(new Date(), "hh:mm a")}
      </h3>
      {props.isLoading ? (
        <figure className="bg-primary w-10 h-10 p-3 rounded-md items-center flex justify-center">
          <LapTimerIcon className="text-white h-5 w-5" />
        </figure>
      ) : (
        getIcon()
      )}
      <div className="flex flex-col justify-center">
        <h3 className="text-white font-bold capitalize text-2xl">
          {props.isLoading ? (
            <Skeleton className="w-48 h-5" />
          ) : (
            cleanEventName()
          )}
        </h3>
        {props.event?.type === "MessageUnlocked" && (
          <p className="text-muted-foreground">
            <span className="text-teal-500 font-bold pr-2">User:</span>
            {formatAddress(props.event._user)}
          </p>
        )}
        {props.event?.type === "MessageLocked" && (
          <p className="text-muted-foreground">
            <span className="text-purple-500 font-bold pr-2">Message Id:</span>
            {formatAddress(props.event._messageId)}
          </p>
        )}
        {props.event?.type === "FeeUpdated" && (
          <div className="flex items-center text-muted-foreground">
            {props.event._oldFee}
            <ArrowSVG className="fill-green-500 mx-3" />
            {props.event._fee}
          </div>
        )}
        {props.event?.type === "MinimumLockUpTimeUpdated" && (
          <div className="flex items-center text-muted-foreground">
            {props.event._prevLockTime} Mins
            <ArrowSVG className="mx-3 fill-blue-500" />
            {props.event._lockTime} Mins
          </div>
        )}
        {props.event?.type === "OwnershipTransferred" && (
          <p className="text-muted-foreground">
            <span className="text-blue-500 font-bold pr-2">New Owner:</span>
            {formatAddress(props.event.newOwner)}
          </p>
        )}
        {props.isLoading && (
          <p className="flex items-center text-xs">
            <span className="text-muted-foreground font-bold pr-2">
              Message Id:
            </span>
            <Skeleton className="w-36 h-2" />
          </p>
        )}
      </div>
    </Card>
  );
};

export default Event;
