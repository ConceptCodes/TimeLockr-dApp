import { FC, useState, useEffect } from "react";

interface IProgressProps {
  timestamp: number;
  messageId: string;
}

const Progress: FC<IProgressProps> = (props: IProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const remap = (
    x: number,
    in_min: number,
    in_max: number,
    out_min: number,
    out_max: number
  ) => ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(new Date().getTime() / 1000);
      const end = new Date(props.timestamp).getTime();

      const totalSeconds = end - now;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor((totalSeconds % 3600) % 60);

      const percent = remap(totalSeconds, 0, 167149355, 0, 100);

      setProgress(percent);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, [props.timestamp]);

  return (
    <div className="flex flex-col space-y-2 border p-4">
      <div className="h-4 bg-gray-400">
        <div
          className="h-full bg-custom-blue"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <p className="text-white font-bold capitalize text-sm">
          <span className="text-custom-blue">Message ID:</span>{" "}
          {props.messageId}
        </p>
        <h3 className="text-white font-bold capitalize">
          {hours > 0
            ? `${hours}h ${minutes}m`
            : minutes > 0
            ? `${minutes}m ${seconds}s`
            : `${seconds}s`}
        </h3>
      </div>
    </div>
  );
};

export default Progress;
