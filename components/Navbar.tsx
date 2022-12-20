import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import Lock from 'public/lock.svg'

const Navbar = () => {
  return (
    <nav className="flex justify-between w-full">
      <div className="flex items-center">
        <Lock className=" fill-custom-teal h-10" />
        <h1 className="text-2xl text-white font-bold ml-2">TimeLockr</h1>
      </div>
      <div className="flex items-center">
        <ConnectWallet colorMode="dark" accentColor="#2191FB" />
      </div>
    </nav>
  );
};

export default Navbar;