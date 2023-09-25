"use client";

import { useMemo, useState } from "react";
import { CrossCircledIcon, EyeNoneIcon } from "@radix-ui/react-icons";

import Event from "./Event";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";

import { useEvents } from "@/hooks/useEvents";

const Loading = () => {
  return (
    <div className="flex flex-col w-full space-y-5 overflow-y-auto">
      {new Array(5).fill(0).map((_, i) => (
        <Event isLoading event={null} key={i} />
      ))}
    </div>
  );
};

const EventLog = () => {
  const { events, loading } = useEvents();
  const [filter, setFilter] = useState<string>();

  const Items = useMemo(() => {
    if (!events) return [];
    if (!filter) return events;
    return events?.filter((event) => event.type === filter);
  }, [events, filter]);

  const handleReset = () => {
    setFilter(undefined);
  };

  return (
    <div className="flex flex-col w-full xl:w-1/2 space-y-5">
      <div className="flex flex-row justify-between">
        <h1 className="text-4xl text-left font-bold">Events</h1>
        <Select onValueChange={setFilter} value={filter}>
          <div className="flex space-x-2 items-center">
            <SelectTrigger className="max-w-[250px]">
              <SelectValue placeholder="Filter"></SelectValue>
            </SelectTrigger>
            {!!filter && (
              <CrossCircledIcon
                onClick={handleReset}
                className="h-5 w-5 text-muted-foreground"
              />
            )}
          </div>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="MessageLocked">Message Locked</SelectItem>
              <SelectItem value="MessageUnlocked">Message Unlocked</SelectItem>
              <SelectItem value="FeeUpdated">Fee Updated</SelectItem>
              <SelectItem value="MinimumLockUpTimeUpdated">
                Min LockUp Time Updated
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[500px] flex flex-col w-full space-y-5">
        {loading && <Loading />}
        {Items?.length === 0 ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
            <EyeNoneIcon className="h-16 w-16 text-muted-foreground/60 dark:text-muted" />
            <h2 className="text-xl font-bold">No Event Logs Found </h2>
            <p className="max-w-sm text-center text-base text-muted-foreground">
              No event logs were found. Try changing the filter or adding a new
              message. If you are using a testnet, make sure you are connected
              to the correct network.
            </p>
          </div>
        ) : (
          Items.map((event, i) => <Event key={i} event={event} />)
        )}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default EventLog;
