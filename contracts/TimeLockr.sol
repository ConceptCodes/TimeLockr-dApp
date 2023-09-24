// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

// TODO: create a mapping of users to their 'activity' and find a way to auto add those power users to whitelist

/**
 * @title TimeLockr
 * @author conceptcodes.eth
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

    error InsufficientFunds(uint256 fee, uint256 amt, uint256 timestamp);
    error EmptyMessage(address user, uint256 timestamp);
    error MessageStillLocked(bytes32 messageId, uint256 timestamp);
    error MessageNotFound(bytes32 messageId, uint256 timestamp);
    error UnauthorizedAccess(
        uint256 timestamp,
        address user,
        bytes32 messageId
    );

    uint256 public FEE = .5 ether;
    uint256 public MIN_LOCK_TIME_IN_SECONDS = 60;

    mapping(address => bool) public whitelist;

    struct Message {
        string encryptedMessage;
        uint256 timeLocked;
        address recipient;
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
     * @notice
     *  - time < 1 day = .5 Native Token
     *  - time > 1 day = .5 Native Token + (.25 Native Token * (time / days))
     */
    function calculateRequiredFee(
        uint256 _timeLocked,
        bool _whitelisted
    ) internal view returns (uint256) {
        uint256 fee = FEE;
        if (!_whitelisted && msg.sender != owner()) {
            fee += (_timeLocked > 1 days)
                ? (_timeLocked >> 1 days) * 0.25 ether
                : 0;
        }
        return fee;
    }

    /**
     * @notice Lock up a message.
     * @dev The message is encrypted with recipients public key from the dApp.
     * @dev We go through our validaitons and then store the message.
     * @param _recipient The address of the user.
     * @param _message The encrypted message.
     * @param _timeLocked The time the message should be locked for.
     */
    function lockMessage(
        address _recipient,
        string calldata _message,
        uint256 _timeLocked
    ) public payable {
        require(_recipient != address(0), "Invalid user address");
        require(
            _recipient != address(this),
            "Recipient address cannot be the contract address"
        );

        bool whitelisted = whitelist[msg.sender];
        uint256 requiredFee = calculateRequiredFee(_timeLocked, whitelisted);
        if (msg.value < requiredFee) {
            revert InsufficientFunds(requiredFee, msg.value, block.timestamp);
        }
        if (bytes(_message).length == 0) {
            revert EmptyMessage(_recipient, block.timestamp);
        }

        bytes32 messageId = keccak256(
            abi.encodePacked(_recipient, msg.sender, block.timestamp, _message)
        );

        vault[_recipient][messageId] = Message({
            encryptedMessage: _message,
            timeLocked: block.timestamp + _timeLocked,
            recipient: _recipient
        });
        emit MessageLocked(_recipient, messageId, block.timestamp);
    }

    /**
     * @notice Unlock a message.
     * @param _messageId The id of the message.
     * @dev We add unlocked message to that users messages array.
     */
    function unlockMessage(bytes32 _messageId) public {
        Message memory message = vault[msg.sender][_messageId];
        if (message.timeLocked > block.timestamp) {
            revert MessageStillLocked(_messageId, block.timestamp);
        }
        if (msg.sender != message.recipient) {
            revert UnauthorizedAccess(block.timestamp, msg.sender, _messageId);
        }
        emit MessageUnlocked(msg.sender, block.timestamp);
        messages[msg.sender].push(_messageId);
    }

    // -------------------- Admin Functions -------------------- //

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
