import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import Lock from "public/lock.svg";
import { ThemeToggle } from "./ui/theme-toggle";

const Navbar = () => {
  return (
    <nav className="flex justify-between w-full">
      <div className="flex items-center">
        <Lock className="fill-primary h-10" />
        <h1 className="text-2xl font-bold ml-2">TimeLockr</h1>
      </div>
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <ConnectWallet />
      </div>
    </nav>
  );
};

export default Navbar;
