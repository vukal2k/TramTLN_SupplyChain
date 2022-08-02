// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'RetailerRole' to manage this role - add, remove, check
contract RetailerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event addRole(address account);
  event removeRole(address account);
  // Define a struct 'retailers' by inheriting from 'Roles' library, struct Role
  struct Retailers {
    Roles.Role member;
  }

  Retailers _retailers;

  // In the constructor make the address that deploys this contract the 1st retailer
  constructor() public {
    _addRetailer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyRetailer() {
    if(isRetailer(msg.sender)==false){
      revert();
    }
    _;
  }

  // Define a function 'isRetailer' to check this role
  function isRetailer(address account) public view returns (bool) {
    return _retailers.member.has(account);
  }

  // Define a function 'addRetailer' that adds this role
  function addRetailer(address account) public onlyRetailer {
    _addRetailer(account);
  }

  // Define a function 'renounceRetailer' to renounce this role
  function renounceRetailer() public {
    _removeRetailer(msg.sender);
  }

  // Define an internal function '_addRetailer' to add this role, called by 'addRetailer'
  function _addRetailer(address account) internal {
    _retailers.member.add(account);
    emit addRole(msg.sender);
  }

  // Define an internal function '_removeRetailer' to remove this role, called by 'removeRetailer'
  function _removeRetailer(address account) internal {
     _retailers.member.remove(account);
    emit removeRole(msg.sender);
  }
}