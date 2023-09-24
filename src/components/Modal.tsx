import React from "react";
import { Web3Button, useContract, useAddress } from "@thirdweb-dev/react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import ethers from "ethers";
import { encryptMessage } from "../../../util";

import "react-datepicker/dist/react-datepicker.css";

interface IModalProps {
  active: boolean;
  handleOnClose: () => void;
}

function Modal(props: IModalProps) {
  const address = useAddress();

  const [message, setMessage] = React.useState("");
  const [lockUpTime, setLockUpTime] = React.useState(new Date());
  const [fee, setFee] = React.useState<number>(1);
  const [recipient, setRecipient] = React.useState<string | undefined>(address);

  React.useEffect(() => {
    setRecipient(address);
  }, [address]);

  if (!props.active) return;

  const labelStyle = "text-sm font-bold text-black";

  const header = (
    <div className="flex items-center bg-background justify-between rounded-t border-slate-200 p-5">
      <h1 className="text-center text-lg font-bold text-white capitalize">
        Lock up a new message
      </h1>
      <button
        type="button"
        className="h-8 w-8 rounded"
        aria-label="Toggle Menu"
        onClick={!!props.handleOnClose && props.handleOnClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="fill-white"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );

  const content = (
    <section>
      <div className="flex flex-col space-y-5 p-5 w-full">
        <div className="flex flex-col space-y-2">
          <label htmlFor="message" className={labelStyle}>
            Recipient
          </label>
          <input
            id="recipient"
            className="border border-slate-200 bg-slate-200 rounded p-2"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="message" className={labelStyle}>
            Message
          </label>
          <textarea
            id="message"
            className="border border-slate-200 bg-slate-200 rounded p-2"
            value={message}
            maxLength={200}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <section className="flex space-between w-full">
          <div className="flex flex-col space-y-2 w-1/2">
            <label htmlFor="lockUpTime" className={labelStyle}>
              Lock up time
            </label>
            <DatePicker
              selected={lockUpTime}
              onChange={(date: Date) => setLockUpTime(date)}
              showTimeSelect
            />
          </div>
          <div className="flex flex-col space-y-2 w-1/2">
            <label htmlFor="fee" className={labelStyle}>
              Fee (${6})
            </label>
            <input
              id="fee"
              className="border border-slate-200 rounded p-2"
              type="number"
              value={fee}
              onChange={(e) => setFee(parseInt(e.target.value))}
            />
          </div>
        </section>
      </div>
    </section>
  );

  const footer = (
    <div id="footer" className="rounded-b p-3">
      <Web3Button
        contractAddress={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string}
        action={(contract) => {
          const encryptedMessage = encryptMessage(message, recipient as string);
          const lockUpTimeInSeconds = Math.floor(lockUpTime.getTime() / 1000);
          contract.call(
            "lockMessage",
            recipient,
            encryptedMessage,
            lockUpTimeInSeconds,
            {
              value: ethers.utils.parseEther(fee.toString()),
            }
          );
        }}
        isDisabled={!message || !recipient || !fee}
        onError={(err) => {
          toast.error(err.message);
        }}
        onSuccess={() => {
          toast.success("Message locked up successfully");
        }}
      >
        Lock Message
      </Web3Button>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-1/2">
          <div className="relative flex w-full flex-col space-y-3 rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {header}
            {content}
            {footer}
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-75"></div>
    </>
  );
}

export default Modal;
