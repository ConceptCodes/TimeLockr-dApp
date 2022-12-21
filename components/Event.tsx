import { FC } from "react";

import ArrowSVG from "public/arrow.svg";
import FeeSVG from "public/fee.svg";
import LockSVG from "public/lock.svg";
import UnlockSVG from "public/unlock.svg";

import { IEvent } from "../hooks/useEvents";
import { formatAddress } from "../util";

interface IEventProps {
  event: IEvent;
}

const Event: FC<IEventProps> = (props: IEventProps) => {
  const getTime = () => {
    const date = new Date(props.event._timestamp);
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    return time;
  };

  const cleanEventName = () => {
    return props.event.type?.split(/(?=[A-Z])/)?.join(" ");
  };

  const btnStyle = (color: string) =>
    `${color} w-14 h-14 rounded-md items-center flex justify-center`;

  const getIcon = () => {
    switch (props.event.type) {
      case "MessageUnlocked":
        return (
          <figure className={btnStyle("bg-custom-teal")}>
            <UnlockSVG />
          </figure>
        );
      case "MessageLocked":
        return (
          <figure className={btnStyle("bg-custom-purple")}>
            <LockSVG className=" fill-black h-10" />
          </figure>
        );
      case "FeeUpdated":
        return (
          <figure className={btnStyle("bg-custom-green")}>
            <FeeSVG />
          </figure>
        );
      case "MinimumLockUpTimeUpdated":
        return (
          <figure className={btnStyle("bg-custom-blue")}>
            <LockSVG className=" fill-black h-10" />
          </figure>
        );
      default:
        return null;
    }
  };

  const titleStyle = "text-white font-bold capitalize text-2xl";

  return (
    <div className="flex flex-row space-x-10 items-center w-full">
      <h3 className="text-white">{getTime()}</h3>
      {getIcon()}
      <div className="flex flex-col justify-center">
        <h3 className={titleStyle}>{cleanEventName()}</h3>
        {props.event.type === "MessageUnlocked" && (
          <p className="text-gray-300">
            <span className="text-custom-teal font-bold pr-2">User:</span>
            {props.event._user}
          </p>
        )}
        {props.event.type === "MessageLocked" && (
          <p className="text-gray-300">
            <span className="text-custom-purple font-bold pr-2">
              Message Id:
            </span>
            {formatAddress(props.event._messageId)}
          </p>
        )}
        {props.event.type === "FeeUpdated" && (
          <div className="flex items-center text-gray-300">
            {props.event._oldFee}
            <ArrowSVG className="fill-custom-green mx-3" />
            {props.event._fee}
          </div>
        )}
        {props.event.type === "MinimumLockUpTimeUpdated" && (
          <div className="flex items-center text-gray-300">
            {props.event._prevLockTime} Mins
            <ArrowSVG className="mx-3 fill-custom-blue" />
            {props.event._lockTime} Mins
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
