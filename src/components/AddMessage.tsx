"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockClosedIcon,
  PlusCircledIcon,
  CalendarIcon,
  LapTimerIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { SmartContract, Web3Button } from "@thirdweb-dev/react";
import {
  format,
  addDays,
  differenceInSeconds,
  differenceInDays,
} from "date-fns";
import { useEffect, useState } from "react";
import { BaseContract } from "ethers";
// import { JSEncrypt } from "jsencrypt";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";

import { cn, formatAddress } from "@/lib";
import { polyToUsd } from "@/lib";
import { env } from "@/env.mjs";
import useThirdWeb from "@/hooks/useThirdWeb";

const AddMessage = () => {
  const [isError, setIsError] = useState(false);
  const { contract, fee, address } = useThirdWeb();
  const { toast } = useToast();

  const formSchema = z.object({
    recipient: z.string().min(1, "Recipient is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    lockUpTime: z
      .date()
      .min(addDays(new Date(), 1), "Lock up time must be in the future"),
    fee: z.coerce.number().min(fee, "Fee must be greater than 0").nonnegative(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: address,
      message: "",
      lockUpTime: addDays(new Date(), 3),
      fee: fee || 0,
    },
  });

  useEffect(() => {
    if (!!address && !form.getValues("recipient"))
      form.setValue("recipient", address);
  }, [address, contract]);

  async function onSubmit(
    values: z.infer<typeof formSchema>,
    contract: SmartContract<BaseContract>
  ) {
    try {
      setIsError(false);
      // const encrypt = new JSEncrypt();
      // encrypt.setPublicKey(values.recipient);
      // const encrypted = encrypt.encrypt(values.message);
      const data = [
        values.recipient,
        // encrypted,
        values.message,
        differenceInSeconds(values.lockUpTime, new Date()),
      ];
      console.log("Making call with values", data);
      await contract?.call("lockMessage", data);
    } catch (error) {
      setIsError(true);
      throw error;
    }
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
        {/* {isError && (
          <Alert variant="destructive" className="mt-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error locking your message. Please try again later.
            </AlertDescription>
          </Alert>
        )} */}
        <Form {...form}>
          <div className="space-y-8">
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
                          disabled={(date) => date < addDays(new Date(), -1)}
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
                    <FormLabel>
                      Fee{" "}
                      <span className="text-primary font-medium">
                        (${polyToUsd(field.value)})
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Base fee is{" "}
                      <span className="text-primary font-bold">
                        {fee} POLY.
                      </span>
                    </FormDescription>
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
                    <Textarea placeholder="Your message" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the message that will be locked up and only
                    accessible by the recipient.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Web3Button
              className={cn(
                buttonVariants({
                  variant: "default",
                })
              )}
              overrides={{
                value: form.getValues("fee") * 10 ** 18,
              }}
              contractAddress={env.NEXT_PUBLIC_CONTRACT_ADDRESS}
              action={async (contract) => {
                await onSubmit(form.getValues(), contract);
              }}
              onSuccess={(result) => {
                console.log(result);
                form.reset();
                toast({
                  title: "Message Locked",
                  description: (
                    <p>
                      Your message has been locked and will be available to{" "}
                      <span className="text-primary font-bold">
                        {formatAddress(form.getValues("recipient"))}
                      </span>{" "}
                      in approximately{" "}
                      {differenceInDays(
                        form.getValues("lockUpTime"),
                        new Date()
                      )}{" "}
                      days.
                    </p>
                  ),
                });
              }}
              onError={(error) => {
                toast({
                  title: "Error",
                  description:
                    error.name ||
                    "There was an error locking your message. Please try again later.",
                  variant: "destructive",
                });
              }}
            >
              Lock Message
            </Web3Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMessage;
