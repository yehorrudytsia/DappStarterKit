const { expect } = require("chai");



describe("Token contract", function () {

    let Token;
    let token;
    let owner;
    let halfOfSupply;

    this.beforeEach(async function () {
        [owner, address1, address2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deployed();

        halfOfSupply = await token.totalSupply() / 2;
    })

    
    describe("Deployment", function () {
        it("Deployment should assign the half of the total supply of tokens to the owner", async function () {
            const ownerBalance = await token.getBalance(owner.address);
            expect(halfOfSupply).to.equal(ownerBalance);
        });
    
        it("Deployment should lock the half of the total supply in special contract", async function () {
            const valueLocked = await token.valueLocked()
            expect(halfOfSupply).to.equal(valueLocked);
        });
    })

    describe("Transaction", function () {
        it("Transaction should transfer tokens between accounts", async function() {
            await token.transfer(await address1.getAddress(), 100);
            expect(await token.getBalance(await address1.getAddress())).to.equal(100);
        });
    })
});



