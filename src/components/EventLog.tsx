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
import { useState } from "react";

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
  const { events } = useEvents();
  const [filter, setFilter] = useState<string>("");

  const filteredEvents = () => {
    if (!events) return [];
    if (filter === "") return events;
    return events.filter((event) => event.type === filter);
  };

  return (
    <div className="flex flex-col w-full xl:w-1/2 space-y-5">
      <div className="flex flex-row justify-between">
        <h1 className="text-4xl text-left font-bold">Events</h1>
        <Select onValueChange={setFilter} value={filter}>
          <SelectTrigger className="max-w-[250px]">
            <SelectValue placeholder="Filter"></SelectValue>
          </SelectTrigger>
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
        {events ? (
          filteredEvents().map((event, i) => <Event key={i} event={event} />)
        ) : (
          <Loading />
        )}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default EventLog;
