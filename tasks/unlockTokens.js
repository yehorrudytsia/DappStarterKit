const fs = require("fs");


task("unlockTokens", "Unlocks given amount of tokens and sends them to the owner")
  .addPositionalParam("tokensAmount", "The address that will receive them")
  .setAction(async ({ tokensAmount }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressFile =
      __dirname + "/../client/src/contracts/contractAddress.json";

    if (!fs.existsSync(addressFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const json = fs.readFileSync(addressFile);
    const address = JSON.parse(json);

    if ((await ethers.provider.getCode(address.Token)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token = await ethers.getContractAt("Token", address.Token);
    const [owner, receiver] = await ethers.getSigners();

    const unlockedTokens = await token.unlockTokens(tokensAmount, receiver.address);
    await unlockedTokens.wait();

    console.log(receiver);
    console.log(`Transferred ${tokensAmount} to the (${receiver.address})`);
  });