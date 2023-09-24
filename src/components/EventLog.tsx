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
      {new Array(10).fill(0).map((_, i) => (
        <Event isLoading event={null} key={i} />
      ))}
    </div>
  );
};

const EventLog = () => {
  const { events } = useEvents();

  return (
    <div className="flex flex-col w-full xl:w-1/2 space-y-5">
      <div className="flex flex-row justify-between">
        <h1 className="text-4xl text-left font-bold">Events</h1>
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue>Filter</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="MessageLocked">Message Locked</SelectItem>
              <SelectItem value="MessageUnlocked">Message Unlocked</SelectItem>
              <SelectItem value="FeeUpdated">Fee Updated</SelectItem>
              <SelectItem value="MinimumLockUpTimeUpdated">
                Minimum Lock Up Time Updated
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[500px] flex flex-col w-full space-y-5">
        {events ? (
          events.map((event, i) => <Event key={i} event={event} />)
        ) : (
          <Loading />
        )}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default EventLog;
