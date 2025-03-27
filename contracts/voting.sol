// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    mapping(address => bool) public voters;
    Candidate[] public candidates;
    address public owner;
    bool public votingOpen = true;
    uint8 public totalVoters;
    uint8 public constant MAX_VOTERS = 20; // Max limit

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(string[] memory _candidateNames) {
        require(_candidateNames.length > 0, "At least one candidate required");
        owner = msg.sender;
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate(_candidateNames[i], 0));
        }
    }

    function vote(uint256 candidateIndex) public {
        require(votingOpen, "Voting is closed");
        require(!voters[msg.sender], "Already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");
        require(totalVoters < MAX_VOTERS, "Voting limit reached");

        voters[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
        totalVoters++;
    }

    function castBulkVotes(uint256 candidateIndex, uint256 extraVotes) public onlyOwner {
        require(votingOpen, "Voting is closed");
        require(candidateIndex < candidates.length, "Invalid candidate");
        require(extraVotes + totalVoters <= MAX_VOTERS, "Exceeds max voters");

        candidates[candidateIndex].voteCount += extraVotes;
        totalVoters += uint8(extraVotes);
    }

    function endVoting() public onlyOwner {
        votingOpen = false;
    }

    function getWinner() public view returns (string memory winnerName, uint256 winnerVotes) {
        require(!votingOpen, "Voting is still open");
        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }

        return (candidates[winnerIndex].name, candidates[winnerIndex].voteCount);
    }
}
