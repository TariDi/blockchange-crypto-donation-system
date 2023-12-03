// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Charity {
    enum CaseStatus {
        InProgress,
        Completed
    }

    struct DonationCase {
        uint256 id;
        uint256 targetAmount;
        CaseStatus status;
        address beneficiary;
        string detailsHash;
        string imageHash;
    }

    address public trustee;
    uint256 private nextCaseId;
    mapping(uint256 => DonationCase) public cases;
    mapping(uint256 => uint256) public currentAmount; // Tracks the amount collected for each case

    event CaseCreated(uint256 caseId, address createdBy, uint256 timestamp);
    event CaseCompleted(uint256 caseId);
    event Donate(
        uint256 caseId,
        address donor,
        uint256 amount,
        uint256 timestamp
    );

    constructor() {
        trustee = msg.sender; // The creator of the contract is the trustee
    }

    function createCaseByBeneficiary(
        uint256 _targetAmount,
        string memory _detailsHash,
        string memory _imageHash
    ) public {
        require(_targetAmount > 0, "Target amount must be greater than zero");

        DonationCase memory newCase = DonationCase({
            id: nextCaseId,
            targetAmount: _targetAmount,
            status: CaseStatus.InProgress,
            beneficiary: msg.sender,
            detailsHash: _detailsHash,
            imageHash: _imageHash
        });

        cases[nextCaseId] = newCase;
        emit CaseCreated(nextCaseId, msg.sender, block.timestamp);
        nextCaseId++;
    }

    function donate(uint256 _caseId) public payable {
        require(cases[_caseId].id == _caseId, "Case does not exist");
        require(
            cases[_caseId].status == CaseStatus.InProgress,
            "Case is not in progress"
        );
        require(msg.sender != trustee, "Charity cannot be a donor");
        require(msg.value > 0, "Donation must be greater than 0");

        currentAmount[_caseId] += msg.value;
        payable(cases[_caseId].beneficiary).transfer(msg.value); // Transfer the donation amount to the beneficiary

        if (currentAmount[_caseId] >= cases[_caseId].targetAmount) {
            cases[_caseId].status = CaseStatus.Completed;
            emit CaseCompleted(_caseId);
        }

        emit Donate(_caseId, msg.sender, msg.value, block.timestamp);
    }


    function listActiveCases() public view returns (DonationCase[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < nextCaseId; i++) {
            if (cases[i].status == CaseStatus.InProgress) {
                activeCount++;
            }
        }

        DonationCase[] memory activeCases = new DonationCase[](activeCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < nextCaseId; i++) {
            if (cases[i].status == CaseStatus.InProgress) {
                activeCases[currentIndex] = cases[i];
                currentIndex++;
            }
        }
        return activeCases;
    }
}