const { expect } = require("chai");



describe("Token contract", function () {

    let Token;
    let token;
    let owner;

    this.beforeEach(async function () {
        [owner] = await ethers.getSigners();
        Token = await ethers.getContractFactory("Token");
    
        token = await Token.deploy();
  
        await token.deployed();
    })

    
    describe("Deployment", function () {
        it("Deployment should assign the half of the total supply of tokens to the owner", async function () {
            const ownerBalance = await token.getBalance(owner.address);
            const halfOfSupply = await token.totalSupply() / 2;
            expect(halfOfSupply).to.equal(ownerBalance);
        });
    
        it("Deployment should lock the half of the total supply in special contract", async function () {
            const halfOfSupply = await token.totalSupply() / 2;
            const valueLocked = await token.valueLocked()
            expect(halfOfSupply).to.equal(valueLocked);
        });
    })
});



