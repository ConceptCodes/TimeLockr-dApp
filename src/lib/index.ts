import { BigNumber } from "ethers";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an eth address to be displayed in the UI
 * @param address {string}
 * @returns {string} formatted address
 */
export function formatAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * converts poly to usd
 * @param amt {number} amount of poly
 */
export function polyToUsd(amt: number): string {
  // TODO: get this from an oracle or third party api
  return Number(amt * 0.520871).toFixed(2);
}

/**
 * convert big number to number
 * @param amt {BigNumber} big number
 * @returns {number} number
 * @throws {Error} if the conversion fails
 */
export function bigNumberToNumber(amt: BigNumber): number {
  const number = amt.toNumber();
  if (!number) {
    throw new Error("Conversion failed");
  }
  return number;
}
