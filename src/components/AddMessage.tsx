import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockClosedIcon,
  PlusCircledIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { useAddress } from "@thirdweb-dev/react";
import { format, addMinutes } from "date-fns";
import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const AddMessage = () => {
  const address = useAddress();

  const formSchema = z.object({
    recipient: z.string().min(1, "Recipient is required"),
    message: z.string().min(10, "Message is required"),
    lockUpTime: z
      .date()
      .min(addMinutes(new Date(), 1), "Lock up time must be in the future"),
    fee: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: address,
      message: "",
      lockUpTime: addMinutes(new Date(), 4),
      fee: 6,
    },
  });

  useEffect(() => {
    if (!!address && !form.getValues("recipient"))
      form.setValue("recipient", address);
  }, [address]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-10 hover:border-primary hover:border-4">
          <CardContent className="flex flex-col items-center justify-center space-y-5 w-full">
            <PlusCircledIcon className="w-5 h-5" />
            <h3 className="font-bold text-md text-center">New Message</h3>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex space-x-3 items-center">
            <LockClosedIcon className="w-5 h-5 mr-2 text-primary" />
            Lock up a new message
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    <Input placeholder="Ethereum Address" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the address that will be able to unlock your
                    message.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row space-x-5 items-center">
              <FormField
                control={form.control}
                name="lockUpTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Lock up time{" "}
                      <span className="text-muted-foreground">(UTC+0)</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < addMinutes(new Date(), 1)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Hello from the other side..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the message that will be locked up and only
                    accessible by the recipient.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!form.formState.isValid}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMessage;
