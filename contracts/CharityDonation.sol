// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract CharityDonation {
    enum CaseStatus { Pending, Processing, Evaluated, Completed, Approved, Rejected }

    struct DonationCase {
        uint id;
        string description;
        uint targetAmount;
        CaseStatus status;
        uint evaluation;
        address beneficiary;
    }

    address public trustee;
    uint private nextCaseId;
    mapping(uint => DonationCase) public cases;
    mapping(uint => uint) public currentAmount; // Tracks the amount collected for each case

    // Assuming calcPercentages is a function that calculates administrative fees
    // and the amount to be sent to the needy. You would need to define this based on your needs.
    // For simplicity, this example will just send a fixed percentage to the trustee as fees.
    uint public adminFeePercentage = 5; // 5% administrative fee

    event CaseCreated(uint caseId, address createdBy, uint timestamp);
    event CaseStatusChanged(uint caseId, CaseStatus status);
    event CaseEvaluated(uint caseId, uint evaluation);
    event CaseApproved(uint caseId, address needy);
    event CaseRejected(uint caseId, address needy);
    event Donate(uint caseId, address donor, uint amount, uint timestamp);
    event CaseCompleted(uint caseId);
    event RefundIssued(address donor, uint amount);

    modifier onlyTrustee() {
        require(msg.sender == trustee, "Caller is not the trustee");
        _;
    }

    constructor() {
        trustee = msg.sender; // The creator of the contract is the trustee
    }

    function createCaseByNeedy(string memory _description, uint _targetAmount) public {
        DonationCase memory newCase = DonationCase({
            id: nextCaseId,
            description: _description,
            targetAmount: _targetAmount,
            status: CaseStatus.Processing,
            evaluation: 0,
            beneficiary: msg.sender
        });

        cases[nextCaseId] = newCase;
        emit CaseCreated(nextCaseId, msg.sender, block.timestamp);
        nextCaseId++;
    }

    function createCaseByTrustee(uint _caseId, uint _evaluation) public onlyTrustee {
        cases[_caseId].evaluation = _evaluation;
        cases[_caseId].status = CaseStatus.Evaluated;
        emit CaseEvaluated(nextCaseId, _evaluation);
    }

    function approveCase(uint _caseId) public onlyTrustee {
        require(cases[_caseId].status == CaseStatus.Processing, "Case is not in Processing status");
        
        cases[_caseId].status = CaseStatus.Approved;
        emit CaseStatusChanged(_caseId, CaseStatus.Approved);
        emit CaseApproved(_caseId, msg.sender);
    }

    function rejectCase(uint _caseId) public onlyTrustee {
        require(cases[_caseId].status == CaseStatus.Processing, "Case is not in Processing status");
        
        cases[_caseId].status = CaseStatus.Rejected;
        emit CaseStatusChanged(_caseId, CaseStatus.Rejected);
        emit CaseRejected(_caseId, msg.sender);
    }

    // The donate function allows a donor to donate to a specific case by its ID.
    function donate(uint _caseId) public payable {
        require(cases[_caseId].status == CaseStatus.Evaluated, "Case must be in Evaluated status");
        require(msg.value > 0, "Donation must be greater than 0");
        require(cases[_caseId].status != CaseStatus.Completed, "Case must not be in Completed status");
        require(cases[_caseId].status != CaseStatus.Rejected, "Case must not be Rejected");

        uint refundAmount = 0;
        uint donationAmount = msg.value;
        uint newAmount = currentAmount[_caseId] + donationAmount;

        if (newAmount > cases[_caseId].targetAmount) {
            refundAmount = newAmount - cases[_caseId].targetAmount;
            donationAmount -= refundAmount;
            payable(msg.sender).transfer(refundAmount); // Refund the excess to the donor
            emit RefundIssued(msg.sender, refundAmount);
        }

        currentAmount[_caseId] += donationAmount;
        //uint adminFee = (donationAmount * adminFeePercentage) / 100;
        uint needyAmount = donationAmount;

        //payable(trustee).transfer(adminFee); // Transfer the admin fee to the trustee
        payable(cases[_caseId].beneficiary).transfer(needyAmount); // Transfer the remaining amount to the needy

        if (newAmount >= cases[_caseId].targetAmount) {
            cases[_caseId].status = CaseStatus.Completed;
            emit CaseCompleted(_caseId);
        }

        emit Donate(_caseId, msg.sender, donationAmount, block.timestamp);
    }
}