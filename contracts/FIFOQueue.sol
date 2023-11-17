// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract FIFOQueue {
    address[] private queue;

    function enqueue(address _item) public {
        queue.push(_item);
    }

    function dequeue() public returns (address) {
        require(!isEmpty(), "Queue is empty");
        address item = queue[0];
        for (uint256 i = 0; i < queue.length - 1; i++) {
            queue[i] = queue[i + 1];
        }
        queue.pop();
        return item;
    }

    function getFront() public view returns (address) {
        require(!isEmpty(), "Queue is empty");
        return queue[0];
    }

    function isEmpty() public view returns (bool) {
        return queue.length == 0;
    }


    function size() public view returns (uint256) {
        return queue.length;
    }
}
