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
        uint256 currentAmount;
        CaseStatus status;
        address beneficiary;
        string detailsHash;
        string imageHash;
    }

    address public trustee;
    uint256 private nextCaseId;
    mapping(uint256 => DonationCase) public cases;
    uint256[] private activeCaseIds;

    event CaseCreated(uint256 caseId, address createdBy, uint256 timestamp);
    event CaseCompleted(uint256 caseId);
    event Donate(
        uint256 caseId,
        address donor,
        uint256 amount,
        uint256 timestamp
    );

    constructor() {
        trustee = msg.sender;
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
            imageHash: _imageHash,
            currentAmount: 0
        });

        cases[nextCaseId] = newCase;
        activeCaseIds.push(nextCaseId);
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

        cases[_caseId].currentAmount += msg.value;
        payable(cases[_caseId].beneficiary).transfer(msg.value);

        if (cases[_caseId].currentAmount >= cases[_caseId].targetAmount) {
            cases[_caseId].status = CaseStatus.Completed;
            removeActiveCase(_caseId);
            emit CaseCompleted(_caseId);
        }

        emit Donate(_caseId, msg.sender, msg.value, block.timestamp);
    }


    function listActiveCases() public view returns (DonationCase[] memory) {
        DonationCase[] memory activeCases = new DonationCase[](activeCaseIds.length);
        for (uint256 i = 0; i < activeCaseIds.length; i++) {
            activeCases[i] = cases[activeCaseIds[i]];
        }
        return activeCases;
    }

    function removeActiveCase(uint256 _caseId) private {
        for (uint256 i = 0; i < activeCaseIds.length; i++) {
            if (activeCaseIds[i] == _caseId) {
                activeCaseIds[i] = activeCaseIds[activeCaseIds.length - 1];
                activeCaseIds.pop();
                break;
            }
        }
    }
}