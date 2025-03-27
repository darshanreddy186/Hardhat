const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
    let Voting, voting, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const candidateNames = ["Alice", "Bob", "Charlie", "David"];
        Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy(candidateNames);
    });

    it("Should allow a voter to vote", async function () {
        await voting.connect(addr1).vote(0);
        expect((await voting.candidates(0)).voteCount).to.equal(1);
    });

    it("Should not allow double voting", async function () {
        await voting.connect(addr1).vote(0);
        await expect(voting.connect(addr1).vote(0)).to.be.revertedWith("Already voted");
    });

    it("Should return the correct winner", async function () {
        await voting.connect(addr1).vote(0);
        await voting.connect(addr2).vote(0);
        await voting.endVoting();
        expect(await voting.getWinner()).to.equal("Alice");
    });
});
