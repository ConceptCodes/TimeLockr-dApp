import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import * as crypto from "crypto";

describe("TimeLockr", function () {
  async function deployTimeLockr() {
    const [owner, otherAccount] = await ethers.getSigners();

    const TimeLockr = await ethers.getContractFactory("TimeLockr");
    const contract = await TimeLockr.deploy();
    const balance = await ethers.provider.getBalance(contract.address);
    const fee = await contract.FEE();
    const minLockTime = await contract.MIN_LOCK_TIME_IN_SECONDS();

    return {
      contract,
      owner,
      otherAccount,
      balance,
      fee,
      minLockTime,
    };
  }

  describe("Deployment", function () {
    it("Should set deployer to owner", async function () {
      const { contract, owner } = await loadFixture(deployTimeLockr);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Balance should be empty", async function () {
      const { balance } = await loadFixture(deployTimeLockr);
      expect(balance).to.equal(ethers.utils.parseEther("0"));
    });
  });

  describe("Locking A Message", function () {
    it("Throw Error: Insufficient Funds/No Funds", async function () {
      const { contract, minLockTime, otherAccount } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = minLockTime;
      const address = otherAccount.address;

      await expect(
        contract.connect(otherAccount).lockMessage(address, message, duration)
      ).to.be.revertedWithCustomError(contract, "InsufficientFunds");
    });

    it("Throw Error: Insufficient Funds/Not Enough Funds", async function () {
      const { contract, minLockTime, otherAccount } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = minLockTime;
      const address = otherAccount.address;

      const amount = ethers.utils.parseEther("0.2");

      await expect(
        contract.connect(otherAccount).lockMessage(address, message, duration, {
          value: amount,
        })
      ).to.be.revertedWithCustomError(contract, "InsufficientFunds");
    });

    it("Owner: Bypass Fee", async function () {
      const { contract, minLockTime, owner } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = minLockTime;
      const address = owner.address;

      const amount = ethers.utils.parseEther("0");

      await expect(
        contract.connect(owner).lockMessage(address, message, duration, {
          value: amount,
        })
      ).to.not.be.reverted;
    });

    it("Owner: Pay Fee", async function () {
      const { contract, minLockTime, owner } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = minLockTime;
      const address = owner.address;

      const amount = ethers.utils.parseEther("1");

      await expect(
        contract.connect(owner).lockMessage(address, message, duration, {
          value: amount,
        })
      ).to.not.be.reverted;
    });

    it("Pay Fee", async function () {
      const { contract, minLockTime, otherAccount } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = minLockTime;
      const address = otherAccount.address;

      const amount = ethers.utils.parseEther("1");

      await expect(
        contract.connect(otherAccount).lockMessage(address, message, duration, {
          value: amount,
        })
      ).to.not.be.reverted;
    });

    it("Balance should increase", async function () {
      const { contract, minLockTime, otherAccount } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = minLockTime;
      const address = otherAccount.address;

      const amount = ethers.utils.parseEther("10");

      await contract
        .connect(otherAccount)
        .lockMessage(address, message, duration, {
          value: amount,
        });

      const balance = await ethers.provider.getBalance(contract.address);

      expect(balance).to.equal(amount);
    });

    it("Whitelisted: Bypass Fee", async function () {
      const { contract, minLockTime, otherAccount, owner } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = minLockTime;
      const address = otherAccount.address;

      const amount = ethers.utils.parseEther("0");

      await expect(
        contract.connect(otherAccount).lockMessage(address, message, duration, {
          value: amount,
        })
      ).to.be.revertedWithCustomError(contract, "InsufficientFunds");

      await contract.connect(owner).addToWhitelist(address);

      await expect(
        contract.connect(otherAccount).lockMessage(address, message, duration, {
          value: amount,
        })
      ).to.not.be.reverted;
    });

    describe("Whitelist", function () {});
  });

  describe("Unlocking A Message", function () {
    it("Throw Error: Message Not Found", async function () {
      const { contract, otherAccount } = await loadFixture(deployTimeLockr);
      const messageId = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("Hello World")
      );
      await expect(contract.connect(otherAccount).unlockMessage(messageId)).to
        .be.reverted;
    });

    it("Throw Error: Message Still Locked", async function () {
      const { contract, minLockTime, otherAccount } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = minLockTime;
      const address = otherAccount.address;
      const amount = ethers.utils.parseEther("5");

      const tx = await contract
        .connect(otherAccount)
        .lockMessage(address, message, duration, {
          value: amount,
        });

      const receipt = await tx.wait();

      const messageId = receipt?.events[0]?.args.messageId;
      await expect(contract.connect(otherAccount).unlockMessage(messageId)).to
        .be.reverted;
    });

    it("Throw Error: Unlock Before Time", async function () {
      const { contract, minLockTime, otherAccount } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = ethers.BigNumber.from(minLockTime).add(10);
      const address = otherAccount.address;
      const amount = ethers.utils.parseEther("5");

      const tx = await contract
        .connect(otherAccount)
        .lockMessage(address, message, duration, {
          value: amount,
        });

      const receipt = await tx.wait();
      const messageId = receipt?.events[0]?.args.messageId;

      await expect(contract.connect(otherAccount).unlockMessage(messageId)).to
        .be.reverted;
    });

    it("Throw Error: Unlock someone else's message", async function () {
      const { contract, minLockTime, otherAccount, owner } = await loadFixture(
        deployTimeLockr
      );
      const message = "Hello World";
      const duration = minLockTime;
      const address = otherAccount.address;
      const amount = ethers.utils.parseEther("5");

      const tx = await contract
        .connect(otherAccount)
        .lockMessage(address, message, duration, {
          value: amount,
        });

      const receipt = await tx.wait();
      const messageId = receipt?.events[0]?.args.messageId;

      await ethers.provider.send("evm_increaseTime", [duration.toNumber()]);
      await expect(contract.connect(owner).unlockMessage(messageId)).to.be
        .reverted;
    });

    it("Encrypt Message/Owner", async function () {
      const { contract, owner } = await loadFixture(deployTimeLockr);

      const message = "Hello World";

      // Get the public key from the owner ethereum address
      const publicKey = ethers.utils.computePublicKey(owner.address);

      const encryptedMessage = crypto.publicEncrypt(
        publicKey,
        Buffer.from(message)
      );

      const duration = await contract.MIN_LOCK_TIME_IN_SECONDS();
      const tx = await contract.lockMessage(
        owner.address,
        encryptedMessage.toString("hex"),
        duration
      );
      const receipt = await tx.wait();
      const messageId = receipt?.events[0]?.args.messageId;

      await ethers.provider.send("evm_increaseTime", [duration.toNumber()]);
      await contract.unlockMessage(messageId);

      // Get the private key of the recipient (the owner)
      const privateKey = owner.;

      // Decrypt the message with the recipient's private key
      const decryptedMessage = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        encryptedMessage
      );

      // Verify the decrypted message matches the original message
      expect(decryptedMessage.toString("utf8")).to.equal(message);
    });

  });

  describe("Access Control", function () {});
});
