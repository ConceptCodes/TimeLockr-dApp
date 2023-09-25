import React from "react";
import { useTheme } from "next-themes";
import { ConnectWallet } from "@thirdweb-dev/react";

import Lock from "public/lock.svg";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Navbar = () => {
  const { theme } = useTheme();
  return (
    <nav className="flex justify-between w-full">
      <div className="flex items-center">
        <Lock className="fill-primary h-10 w-10" />
        <h1 className="text-2xl font-bold ml-2">TimeLockr</h1>
      </div>
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <ConnectWallet switchToActiveChain theme={theme as "light" | "dark"} />
      </div>
    </nav>
  );
};

export default Navbar;
