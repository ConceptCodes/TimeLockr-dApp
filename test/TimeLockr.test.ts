import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TimeLockr } from "../typechain-types";

describe("TimeLockr", function () {
  let contract: TimeLockr;
  let owner: ethers.Signer;
  let recipient: ethers.Signer;

  beforeEach(async function () {
    contract = await ethers.getContractFactory("TimeLockr").deploy();
    owner = await ethers.getSigners()[0];
    recipient = await ethers.getSigners()[1];
  });

  it("should lock a message", async function () {
    const message = "This is a secret message.";
    const timeLocked = 60 * 60; // 1 hour

    const tx = await contract.lockMessage(
      recipient.address,
      message,
      timeLocked,
      {
        value: ethers.utils.parseEther("0.5"),
      }
    );
    await tx.wait();

    const messageId = tx.logs[0].args[1];
    const storedMessage = await contract.messages(recipient.address, messageId);

    expect(storedMessage).to.equal(message);
    expect(storedMessage.recipient).to.equal(recipient.address);
  });

  it("should not lock a message if the fee is not paid", async function () {
    const message = "This is a secret message.";
    const timeLocked = 60 * 60; // 1 hour

    await expect(
      contract.lockMessage(recipient.address, message, timeLocked)
    ).to.be.revertedWith("InsufficientFunds");
  });

  it("should unlock a message after the time has expired", async function () {
    const message = "This is a secret message.";
    const timeLocked = 1; // 1 second

    await contract.lockMessage(recipient.address, message, timeLocked, {
      value: ethers.utils.parseEther("0.5"),
    });

    await ethers.provider.send("evm_increaseTime", [timeLocked]);

    const tx = await contract.unlockMessage(
      await contract.messages(recipient.address, 0)
    );
    await tx.wait();

    expect(await contract.messages(recipient.address, 0)).to.be.empty;
  });

  it("should not unlock a message before the time has expired", async function () {
    const message = "This is a secret message.";
    const timeLocked = 60 * 60; // 1 hour

    await contract.lockMessage(recipient.address, message, timeLocked, {
      value: ethers.utils.parseEther("0.5"),
    });

    await expect(
      contract.unlockMessage(await contract.messages(recipient.address, 0))
    ).to.be.revertedWith("MessageStillLocked");
  });

  it("should not unlock a message from the wrong user", async function () {
    const message = "This is a secret message.";
    const timeLocked = 60 * 60; // 1 hour

    await contract.lockMessage(recipient.address, message, timeLocked, {
      value: ethers.utils.parseEther("0.5"),
    });

    await expect(
      contract
        .connect(owner)
        .unlockMessage(await contract.messages(recipient.address, 0))
    ).to.be.revertedWith("UnauthorizedAccess");
  });
});
