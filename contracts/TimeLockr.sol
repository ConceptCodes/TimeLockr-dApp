// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

// TODO: create a mapping of users to their 'activity' and find a way to auto add those power users to whitelist

/**
 * @title TimeLockr
 * @author conceptcodes.eth x John Hillert
 * @notice A simple smart contract to store & lock up encrypted messages on-chain.
 * @notice For this service you pay a small fee in the native token.
 * @dev The message is encrypted with the recipient's public key from the dApp.
 */
contract TimeLockr is Ownable {
    /**
     * @notice Error definitions.
     * @dev Most of these validations are done on the dApp side.
     *      But we add them here incase you want to use the contract directly.
     */

    /// @dev Emitted when the fee is too low.
    error InsufficientFunds(uint256 fee, uint256 timestamp);

    /// @dev Emitted if the message is empty.
    error EmptyMessage(address user, uint256 timestamp);

    /// @dev Emitted if you try to unlock a message that is still locked.
    error MessageStillLocked(bytes32 messageId, uint256 timestamp);

    /// @dev Emitted if you try to unlock a message that doesn't exist.
    error MessageNotFound(bytes32 messageId, uint256 timestamp);

    uint256 public FEE = .5 ether;
    uint256 public MIN_LOCK_TIME_IN_SECONDS = 60;

    /// @notice Whitelisted addresses that don't need to pay the fee.
    mapping(address => bool) public whitelist;

    struct Message {
        string encryptedMessage;
        uint256 timeLocked;
    }

    /**
     * @notice Mapping of messages.
     * @dev Only accesible by the contract.
     * @dev Every user will have a mapping of messages with [messageId => Message]
     */
    mapping(address => mapping(bytes32 => Message)) private vault;

    /**
     * @notice Mapping of user messages.
     * @dev We set this to public so that the dApp can access it.
     * @dev Every user will have an array of messageIds with [address => messageId[]]
     */
    mapping(address => bytes32[]) public messages;

    /**
     * @notice Emitted when a message is locked.
     * @param user The address of the recipient.
     * @param messageId The id of the message.
     * @param timestamp The timestamp of this event.
     */
    event MessageLocked(
        address indexed user,
        bytes32 messageId,
        uint256 timestamp
    );

    /**
     * @notice Emitted when a message is unlocked.
     * @param user The address of the sender.
     * @param timestamp The timestamp of this event.
     */
    event MessageUnlocked(address indexed user, uint256 timestamp);

    /**
     * @notice Emitted when the fee is updated.
     * @param prevFee The old fee.
     * @param fee The new fee.
     * @param timestamp The timestamp of this event.
     */
    event FeeUpdated(uint256 prevFee, uint256 fee, uint256 timestamp);

    /**
     * @notice Emitted when the minimum lock up time is updated.
     * @param prevLockTime The old lock up time.
     * @param lockTime The new lock up time.
     * @param timestamp The timestamp of this event.
     */
    event MinimumLockUpTimeUpdated(
        uint256 prevLockTime,
        uint256 lockTime,
        uint256 timestamp
    );

    /**
     * @notice Emitted when a new address is added to the whitelist.
     * @param user The address that was added.
     * @param timestamp The timestamp of this event.
     */
    event AddedToWhitelist(address user, uint256 timestamp);

    /**
     * @notice Emitted when an address is removed from the whitelist.
     * @param user The address that was removed.
     * @param timestamp The timestamp of this event.
     */
    event RemovedFromWhitelist(address user, uint256 timestamp);

    constructor() {}

    /**
     * @notice Lock up a message.
     * @notice
     * - < 1 day = .5 Native Token
     * - > 1 day = .5 Native Token + (.25 Native Token * days locked)
     * @dev The message is encrypted with recipients public key from the dApp.
     * @dev We go through our validaitons and then store the message.
     * @param _user The address of the user.
     * @param _message The encrypted message.
     * @param _timeLocked The time the message should be locked for.
     */
    function lockMessage(
        address _user,
        string calldata _message,
        uint256 _timeLocked
    ) public payable {
        require(_user != address(0));
        bool whitelisted = whitelist[msg.sender];
        if (!whitelisted && msg.sender != owner()) {
            if (_timeLocked > 1 days) {
                if (msg.value < FEE + ((_timeLocked / 1 days) * .25 ether)) {
                    revert InsufficientFunds(msg.value, block.timestamp);
                }
            } else {
                if (msg.value < FEE) {
                    revert InsufficientFunds(msg.value, block.timestamp);
                }
            }
        }
        if (bytes(_message).length == 0) {
            revert EmptyMessage(_user, block.timestamp);
        }
        bytes32 messageId = keccak256(
            abi.encodePacked(_user, block.timestamp, _message)
        );
        vault[_user][messageId] = Message({
            encryptedMessage: _message,
            timeLocked: block.timestamp + _timeLocked
        });
        emit MessageLocked(_user, messageId, block.timestamp);
    }

    /**
     * @notice Unlock a message.
     * @param _messageId The id of the message.
     * @dev We add unlocked message to that users messages array.
     */
    function unlockMessage(bytes32 _messageId) public {
        Message memory message = vault[msg.sender][_messageId];
        if (message.timeLocked == 0) {
            revert MessageNotFound(_messageId, block.timestamp);
        }
        if (block.timestamp >= message.timeLocked) {
            emit MessageUnlocked(msg.sender, block.timestamp);
            messages[msg.sender].push(_messageId);
        } else {
            revert MessageStillLocked(_messageId, block.timestamp);
        }
    }

    /**
     * @notice Get all unlocked messages and messageIds for a user.
     * @return unlockedMessages An array of unlocked messages.
     */
    function getAllUnlockedMessages()
        public
        view
        returns (bytes32[] memory, string[] memory)
    {
        bytes32[] memory unlockedMessages = new bytes32[](
            messages[msg.sender].length
        );
        string[] memory unlockedMessagesData = new string[](
            messages[msg.sender].length
        );
        uint256 numUnlockedMessages = 0;
        for (uint256 i = 0; i < messages[msg.sender].length; i++) {
            bytes32 messageId = messages[msg.sender][i];
            Message memory message = vault[msg.sender][messageId];
            if (block.timestamp >= message.timeLocked) {
                unlockedMessages[numUnlockedMessages] = messageId;
                unlockedMessagesData[numUnlockedMessages] = message
                    .encryptedMessage;
                numUnlockedMessages++;
            }
        }
        bytes32[] memory result = new bytes32[](numUnlockedMessages);
        string[] memory resultData = new string[](numUnlockedMessages);
        for (uint256 i = 0; i < numUnlockedMessages; i++) {
            result[i] = unlockedMessages[i];
            resultData[i] = unlockedMessagesData[i];
        }
        return (result, resultData);
    }

    function getLockedMessages() public view returns (bytes32[] memory) {
        bytes32[] memory lockedMessages = new bytes32[](
            messages[msg.sender].length
        );
        uint256 numLockedMessages = 0;
        for (uint256 i = 0; i < messages[msg.sender].length; i++) {
            bytes32 messageId = messages[msg.sender][i];
            Message memory message = vault[msg.sender][messageId];
            if (block.timestamp < message.timeLocked) {
                lockedMessages[numLockedMessages] = messageId;
                numLockedMessages++;
            }
        }
        bytes32[] memory result = new bytes32[](numLockedMessages);
        for (uint256 i = 0; i < numLockedMessages; i++) {
            result[i] = lockedMessages[i];
        }
        return result;
    }

    /**
     * @notice Update the fee.
     * @param _fee The new fee.
     * @dev We use onlyOwner modifier to restrict access
     */
    function updateFee(uint256 _fee) public onlyOwner {
        emit FeeUpdated(FEE, _fee, block.timestamp);
        FEE = _fee;
    }

    /**
     * @notice Update the minimum lock time.
     * @param _minimumLockTime The new minimum lock time.
     * @dev We use onlyOwner modifier to restrict access
     */
    function updateMinimumLockTime(uint256 _minimumLockTime) public onlyOwner {
        emit MinimumLockUpTimeUpdated(
            MIN_LOCK_TIME_IN_SECONDS,
            _minimumLockTime,
            block.timestamp
        );
        MIN_LOCK_TIME_IN_SECONDS = _minimumLockTime;
    }

    /**
     * @notice Add an address to the whitelist.
     * @param _address The address to add.
     * @dev We use onlyOwner modifier to restrict access
     */
    function addToWhitelist(address _address) public onlyOwner {
        whitelist[_address] = true;
        emit AddedToWhitelist(_address, block.timestamp);
    }

    /**
     * @notice Remove an address from the whitelist.
     * @param _address The address to remove.
     * @dev We use onlyOwner modifier to restrict access
     */
    function removeFromWhitelist(address _address) public onlyOwner {
        whitelist[_address] = false;
        emit RemovedFromWhitelist(_address, block.timestamp);
    }

    /**
     * @notice withdraw funds from the contract.
     * @dev We use onlyOwner modifier to restrict access
     */
    function withdrawBalance() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
