require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      accounts: {
        count: 25, // Ensures at least 25 accounts are generated
      },
    },
  },
};
