require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("./tasks/accounts");

module.exports = {
  solidity: "0.8.9",
};
