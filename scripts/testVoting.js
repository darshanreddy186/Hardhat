const hre = require("hardhat");

async function main() {
    const [owner, ...voters] = await hre.ethers.getSigners();

    // Ensure we have at least 20 voters
    if (voters.length < 20) {
        console.error("Not enough accounts for 20 voters!");
        return;
    }

    // Replace with your deployed contract address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Attach to the deployed contract
    const voting = await hre.ethers.getContractAt("Voting", contractAddress);
    console.log("Contract attached at:", voting.target);

    // Check candidates
    console.log("\nCandidates:");
    for (let i = 0; i < 4; i++) {
        let candidate = await voting.candidates(i);
        console.log(`${i}: ${candidate.name} - ${candidate.voteCount} votes`);
    }

    // Voting process
    console.log("\nVoters are casting votes...");
    for (let i = 0; i < 20; i++) {
        let candidateIndex;
        
        if (i < 10) {
            candidateIndex = 0; // First 10 voters vote for Candidate 0
        } else {
            candidateIndex = (i % 3) + 1; // Remaining voters distribute votes among Candidate 1, 2, and 3
        }

        await voting.connect(voters[i]).vote(candidateIndex);
        console.log(`Voter ${i + 1} voted for Candidate ${candidateIndex}`);
    }

    // Display votes after voting
    console.log("\nVotes after voting:");
    for (let i = 0; i < 4; i++) {
        let candidate = await voting.candidates(i);
        console.log(`${i}: ${candidate.name} - ${candidate.voteCount} votes`);
    }

    // Check if specific voters have voted
    console.log("\nChecking if voters have voted:");
    for (let i = 0; i < 5; i++) {  // Checking first 5 voters for brevity
        console.log(`Voter ${i + 1} voted:`, await voting.voters(voters[i].address));
    }

    // End voting and get the winner
    console.log("\nEnding voting...");
    await voting.endVoting();

    console.log("\nWinner of the election:", await voting.getWinner());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
