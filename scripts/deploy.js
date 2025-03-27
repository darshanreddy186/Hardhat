const hre = require("hardhat");

async function main() {
    const candidateNames = ["Alice", "Bob", "Charlie", "David"]; // 4 Candidates

    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(candidateNames); // No .deployed() needed

    console.log(`Voting contract deployed at: ${voting.target}`); // Correct way to access the deployed contract

    // ✅ Now we access the deployment transaction
    console.log("Deployment gas cost:", (await voting.deploymentTransaction()).gasLimit.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
