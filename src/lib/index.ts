import crypto from "crypto";
import { BigNumber } from "ethers";

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
 * Encrypts a message using the public key of the recipient
 * @param message {string} message to be encrypted
 * @param recipientPublicKey {string} public key of the recipient
 * @returns {string} encrypted message
 * @throws {Error} if the message is empty
 * @throws {Error} if the recipient's public key is empty
 * @throws {Error} if the encryption fails
 */
export function encryptMessage(
  message: string,
  recipientPublicKey: string
): string {
  console.log("encrypting message", message, recipientPublicKey);
  if (!message) {
    throw new Error("Message cannot be empty");
  }
  if (!recipientPublicKey) {
    throw new Error("Public key cannot be empty");
  }

  const encrypted = crypto
    .publicEncrypt(recipientPublicKey, Buffer.from(message))
    .toString();

  if (!encrypted) {
    throw new Error("Encryption failed");
  }

  return encrypted;
}

/**
 * Decrypts a message using the private key of the recipient
 * @param encryptedMessage {string} encrypted message
 * @param recipientPrivateKey {string} private key of the recipient
 * @returns {string} decrypted message
 * @throws {Error} if the encrypted message is empty
 * @throws {Error} if the recipient's private key is empty
 * @throws {Error} if the decryption fails
 */
export function decryptMessage(
  encryptedMessage: string,
  recipientPrivateKey: string
): string {
  if (!encryptedMessage) {
    throw new Error("Encrypted message cannot be empty");
  }
  if (!recipientPrivateKey) {
    throw new Error("Recipient's private key cannot be empty");
  }

  const decrypted = crypto
    .privateDecrypt(recipientPrivateKey, Buffer.from(encryptedMessage))
    .toString();

  if (!decrypted) {
    throw new Error("Decryption failed");
  }

  return decrypted;
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
