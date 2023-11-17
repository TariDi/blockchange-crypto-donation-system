// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;
//import "./Donation.sol";
import "./FIFOQueue.sol";


contract UsesDonation {
    address public donation;
    struct Donation {
        uint256  id;
        address  donor;
        uint256  amount;
        address  charity;
        address  cause;
        uint256  timestamp;
    }
    uint256 private donationId=0;

    function _createDonation(address _donor, uint256 _amount, address _charity, address _cause, uint256 _timestamp) internal returns (Donation memory) {
        Donation memory d = Donation(++donationId,_donor, _amount, _charity,_cause, _timestamp);
        return d;
    }

    function getAddress() public view returns (address) {
        return donation;
    }
}

contract Cause is UsesDonation{
    address public cause;
    mapping(address => Donation) availableFunds;
    mapping(address => bool) donors;
    mapping(address => bool) registeredBeneficiaries;
    struct FundRequest {
        uint256 timestamp;
        uint256 amount;
    }
    mapping(address => FundRequest) requestsInfo;
    FIFOQueue activeRequests = new FIFOQueue();
    FIFOQueue donorQueue = new FIFOQueue();
    

    uint public constant ETH_MULTIPLIER = 1000000000000000000;

    constructor(address _cause) {
        cause = _cause;
    }

    event FundsAllotted(address indexed donor, address indexed cause, uint256 amount, uint256 timestamp);

    //function getBalance() public view returns ()
    function getBalance() public view returns (uint256) {
        return cause.balance;
    }


    function getCause() public view returns (address) {
        return cause; // Returning the state variable's value
    }

    function requestFunding(uint256 requestedAmt) public {
        //checks if beneficiary address is valid and registered
        require(registeredBeneficiaries[msg.sender], "Beneficiary cannot get funding from this Cause");
        //checks if beneficiary has already made a request - reject
        require(requestsInfo[msg.sender].timestamp == 0, "Beneficiary already has a pending request");
        //after checks 
        //if funds available -- transfer
        FundRequest memory f = FundRequest(block.timestamp, requestedAmt);
        requestsInfo[msg.sender] = f;
        activeRequests.enqueue(msg.sender);


        //else adds request to queue
    }

    function processFundingRequests() public {
        //triggered every hour
        //processes fund requests in Fifo
        //subtracts funds in a Fifo manner from the donations
        //emits donation details after processing
        //emits to beneficiary that request has been processed
        require(msg.sender == cause, "Can only be executed by owner");
        address requester = activeRequests.getFront();
        uint256 requestedAmt = requestsInfo[requester].amount;
        if(address(this).balance > requestedAmt) {
            while (requestedAmt > 0) {
                address curr = donorQueue.getFront();
                if(requestedAmt >= availableFunds[curr].amount || availableFunds[curr].amount != 0) {
                    requestedAmt -= availableFunds[curr].amount;
                    availableFunds[curr].amount = 0;
                    address temp1 =donorQueue.dequeue();
                    donors[curr] = false;
                }
                else {
                    availableFunds[curr].amount -= requestedAmt;
                    requestedAmt = 0;
                }
            }
        }
        payable(requester).transfer(requestsInfo[requester].amount*ETH_MULTIPLIER);
        address temp = activeRequests.dequeue();
    }

    function addFunds(address _donor, Donation memory d) public {
        //called by charity
        //adds funds to available funds section
        require(availableFunds[_donor].amount!=0, "Donation for this cause already exists.");
        availableFunds[_donor] = _createDonation(d.donor, d.amount, d.charity, d.cause, d.timestamp);
        emit FundsAllotted(_donor, address(this), d.amount, block.timestamp);
    }

    function registerBeneficiaries() public {
        //some checks are done and beneficiary address added
        // cause should not be already registered
        require(!registeredBeneficiaries[address(msg.sender)], "Beneficiary already registered.");
        //verify cause
        //add to mapping
        registeredBeneficiaries[address(msg.sender)] = true;
    } 
}


contract Charity is UsesDonation{
    //stored in persistent storage
    address public owner;
    mapping(address => Donation) receivedDonations;
    mapping(address => bool) donors;
    //mapping(address => Donation[]) processedDonations;
    mapping(address => Cause) registeredCauses;
    mapping(address => bool) causes;
    FIFOQueue causeQueue = new FIFOQueue();
    FIFOQueue donorQueue= new FIFOQueue();

    // events are the most cheapest way to store data in blockchain
    event DonationMade(address indexed donor, uint256 amount, uint256 donationId, uint256 timestamp);
    event DonationVerified(address indexed donor);
    uint public constant ETH_MULTIPLIER = 1000000000000000000;

    constructor() {
        owner = msg.sender;
    }

     modifier onlyCharity() {
        require(msg.sender == owner, "Only the charity can call this function");
        _;
    }

    function makeDonation(address _cause) public payable {
        require(msg.sender != owner, "Contract cannot make a donation");
        require(msg.value > 0, "Donation amount must be greater than zero");
        require(donors[msg.sender] != true, "Existing Donation needs to be processed.") ;
        require(causes[_cause] == true, "This Cause does not exist in the Charity.");

        Donation memory donation = _createDonation(msg.sender, msg.value, address(this), _cause, block.timestamp);
        receivedDonations[msg.sender]=donation;
        donors[msg.sender] = true;
        donorQueue.enqueue(msg.sender);
        emit DonationMade(msg.sender, msg.value, donation.id, donation.timestamp);
    }

    function registerCause(address _cause) public {
        // cause should not be already registered
        require(msg.sender == owner, "Only owner can register causes");
        require(causes[_cause] != true, "Cause not already registered.");
        //verify cause
        //add to mapping
        registeredCauses[_cause] = new Cause(_cause);
        causes[_cause] = true;
        causeQueue.enqueue(_cause);

    }

    function allocateFunds(address causeAddress, uint256 amount) public {
        require(msg.sender == owner, "Only owner can allocate funds");
        require(address(this).balance >= amount, "Insufficient balance");
        //allocate funds to a particular cause if specified or in fifo manner
        uint256 transferAmt = amount;
        while (amount > 0) {
            address curr = donorQueue.getFront();
            if(amount >= receivedDonations[curr].amount && causeAddress == receivedDonations[curr].cause && receivedDonations[curr].amount!=0) {
                amount -= receivedDonations[curr].amount;
                Donation memory d = _createDonation(curr, receivedDonations[curr].amount, address(this), causeAddress, block.timestamp);
                registeredCauses[causeAddress].addFunds(curr, d);
                receivedDonations[curr].amount = 0;
                address temp = donorQueue.dequeue();
                donors[curr] = false;
            }
            else {
                receivedDonations[curr].amount -= amount;
                amount = 0;
            }
            amount = 0;
        }
        payable(causeAddress).transfer(transferAmt*ETH_MULTIPLIER);
    }

    // Additional functions...
    // function getDonation(address _donor) public view returns (uint256, bool) {
    //     Donation memory donation = donations[_donor];
    //     return (donation.amount, donation.isVerified);
    // }
}


contract Beneficiary {
    address public beneficiary;

    event fundsReceivedAtEndpoint(address indexed donor, address indexed beneficiary, uint256 amount, uint256 timestamp);

    constructor(address _beneficiary) {
        beneficiary = _beneficiary;
    }

    function getBeneficiary() public view returns (address) {
        return beneficiary;
    }

    function acceptFunds(address _donor, uint256 _amount) public payable {
        //check balance 
        emit fundsReceivedAtEndpoint(_donor, address(this), _amount, block.timestamp);
    }

}

