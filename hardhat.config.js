module.exports = {
  solidity: {
    compilers: [{
      version: "0.8.9",
    }],
    settings: {      
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode",
            "evm.deployedBytecode",
          ],
        },
      },
    },
  },
};
