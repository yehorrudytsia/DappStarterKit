task("accounts", "Shows the list of accounts", async () => {
    const accounts = await ethers.getSigners();
    for (const account of accounts) {
      console.log(account.address);
    }
  });