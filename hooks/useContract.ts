import { useContract, useAccount } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";

export const useMyContract = () => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [baseFee, setBaseFee] = useState<number | undefined>(undefined);
  const contract = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

  const account = useAccount();


      
  return { address, baseFee }
};
