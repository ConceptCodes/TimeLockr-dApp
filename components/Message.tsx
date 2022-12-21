import NotepadSVG from 'public/notepad.svg';
import { FC } from 'react';

interface IMessageProps {
  messageId: string;
  message: string;
  timestamp: number;
}

const Message: FC<IMessageProps> = (props: IMessageProps) => {
  const cleanTimestamp = () => {
    const date = new Date(props.timestamp);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const day = date.getDate();
    const cleanDate = `${month} ${day}`;
    return cleanDate;
  };

  const getColor = () => {
    const opts = [
      "custom-teal",
      "custom-purple",
      "custom-green",
      "custom-blue",
    ];

    return opts[Math.floor(Math.random() * opts.length)];
  }
  return (
    <figure
      className={[
        "flex flex-none flex-col p-5 rounded justify-evenly w-[350px] h-[250px]",
        "bg-" + getColor(),
      ].join(" ")}
    >
      <div className="flex flex-row items-center justify-between">
        <NotepadSVG className="" />
        <h3 className="text-black font-bold">{cleanTimestamp()}</h3>
      </div>
      <p className="text-xl truncate">"{props.message}"</p>
      <hr className="border-b-2 border-black" />
      <p className="text-black font-bold">Message Id: {props.messageId}</p>
    </figure>
  );
};

export default Message;