import { useContractRead, useAddress } from "@thirdweb-dev/react";
import { SmartContract, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BaseContract } from "ethers";
import { useEffect, useState } from "react";

import { env } from "@/env.mjs";

const useThirdWeb = () => {
  const [contract, setContract] = useState<SmartContract<BaseContract> | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const sdk = new ThirdwebSDK("polygon", {
    clientId: env.NEXT_PUBLIC_THIRD_WEB_CLIENT_ID,
  });
  const address = useAddress();
  const { data: owner } = useContractRead(contract, "owner");
  const { data: fee } = useContractRead(contract, "FEE");
  const { data: minimumLockTime } = useContractRead(
    contract,
    "MIN_LOCK_TIME_IN_SECONDS"
  );

  async function getContract() {
    const result = await sdk.getContract(env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    setContract(result);
    setLoading(false);
  }

  useEffect(() => {
    getContract();
    if (address && owner) {
      setIsOwner(address === owner);
    }
  }, []);

  return {
    contract,
    loading,
    isOwner,
    fee: fee / 10 ** 18,
    minimumLockTime,
    address,
  };
};

export default useThirdWeb;
