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
    uint8 public totalVoters = 0;
    uint8 public constant MAX_VOTERS = 20; // Limit voters to 20

    constructor(string[] memory _candidateNames) {
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

    function endVoting() public {
        require(msg.sender == owner, "Only owner can end voting");
        votingOpen = false;
    }

    function getWinner() public view returns (string memory winnerName) {
        require(!votingOpen, "Voting is still open");
        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        return candidates[winnerIndex].name;
    }
}
