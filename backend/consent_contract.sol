// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConsentManager {
    struct Consent {
        address patient;
        bool consentGiven;
        uint timestamp;
    }
    mapping(address => Consent) public consents;

    function giveConsent() public {
        consents[msg.sender] = Consent(msg.sender, true, block.timestamp);
    }
    function revokeConsent() public {
        consents[msg.sender] = Consent(msg.sender, false, block.timestamp);
    }
    function hasConsented(address patient) public view returns (bool) {
        return consents[patient].consentGiven;
    }
}
