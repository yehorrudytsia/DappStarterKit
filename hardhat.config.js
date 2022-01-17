require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("./tasks/accounts");
require("./tasks/unlockTokens");

module.exports = {
  solidity: "0.8.9",
};
