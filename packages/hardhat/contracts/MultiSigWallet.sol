pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT

contract MultiSigWalletFactory {
    MultiSigWallet[] public wallets;
    event WalletCreated();

    function getWallets() public view returns (MultiSigWallet[] memory) {
        return wallets;
    }

    function create(address[] memory _owners, uint256 _numConfirmationsRequired)
        public
    {
        MultiSigWallet wallet = new MultiSigWallet(
            _owners,
            _numConfirmationsRequired
        );
        wallets.push(wallet);
        emit WalletCreated();
    }
}

contract MultiSigWallet {
    event Deposit(uint256 amount, address from);
    event TransactionApproved(uint256 txIndex, address from);
    event ApprovalRevoked(uint256 txIndex, address from);

    uint256 public numConfirmationsRequired;
    mapping(address => bool) public isOwner;
    mapping(uint256 => mapping(address => bool)) isConfirmed;
    Transaction[] public transactions;

    struct Transaction {
        address to;
        bool executed;
        uint256 numConfirmations;
        uint256 value;
        bytes data;
    }

    receive() external payable {
        emit Deposit(msg.value, msg.sender);
    }

    modifier onlyOwner(address _address) {
        require(isOwner[_address], "Only wallet owners allowed");
        _;
    }

    modifier txConfirmedByOwner(uint256 txIndex, address _owner) {
        require(isConfirmed[txIndex][_owner]);
        _;
    }

    modifier txNotConfirmedByOwner(uint256 txIndex, address _owner) {
        require(!isConfirmed[txIndex][_owner]);
        _;
    }

    modifier txIsConfirmed(uint256 _txIndex) {
        require(
            transactions[_txIndex].numConfirmations >= numConfirmationsRequired,
            "Not enough confirmations"
        );
        _;
    }

    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) {
        numConfirmationsRequired = _numConfirmationsRequired;
        for (uint256 i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true;
        }
    }

    function submitTransaction(
        address _to,
        uint256 _value,
        bytes memory _data
    ) public onlyOwner(msg.sender) {
        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                numConfirmations: 0,
                executed: false,
                data: _data
            })
        );
    }

    function approveTransaction(uint256 _txIndex)
        public
        onlyOwner(msg.sender)
        txNotConfirmedByOwner(_txIndex, msg.sender)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;
        emit TransactionApproved(_txIndex, msg.sender);
    }

    function denyTransaction(uint256 _txIndex)
        public
        onlyOwner(msg.sender)
        txConfirmedByOwner(_txIndex, msg.sender)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;
    }

    function executeTransaction(uint256 _txIndex)
        public
        txIsConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.executed, "Transaction was already executed.");

        (bool success, bytes memory data) = transaction.to.call{
            value: transaction.value
        }("");
        require(success, "Transaction Failed...");

        transaction.executed = true;
    }
}
