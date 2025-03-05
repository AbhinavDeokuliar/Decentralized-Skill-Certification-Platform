// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedSkillCertification {
    struct Certification {
        uint256 id;
        string skill;
        string level;
        address issuer;
        address recipient;
        uint256 timestamp;
    }

    mapping(uint256 => Certification) public certifications;
    mapping(address => uint256[]) public recipientCertifications;
    mapping(address => uint256[]) public issuerCertifications;

    uint256 public nextCertificationId;
    address public owner;

    event CertificationIssued(
        uint256 id,
        string skill,
        string level,
        address indexed issuer,
        address indexed recipient,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertification(address _recipient, string memory _skill, string memory _level) public {
        uint256 certificationId = nextCertificationId++;
        certifications[certificationId] = Certification({
            id: certificationId,
            skill: _skill,
            level: _level,
            issuer: msg.sender,
            recipient: _recipient,
            timestamp: block.timestamp
        });

        recipientCertifications[_recipient].push(certificationId);
        issuerCertifications[msg.sender].push(certificationId);

        emit CertificationIssued(certificationId, _skill, _level, msg.sender, _recipient, block.timestamp);
    }

    function getCertificationById(uint256 _certificationId) public view returns (Certification memory) {
        return certifications[_certificationId];
    }

    function getCertificationsByRecipient(address _recipient) public view returns (uint256[] memory) {
        return recipientCertifications[_recipient];
    }

    function getCertificationsByIssuer(address _issuer) public view returns (uint256[] memory) {
        return issuerCertifications[_issuer];
    }

    function verifyCertification(uint256 _certificationId) public view returns (bool) {
        Certification memory cert = certifications[_certificationId];
        return cert.timestamp != 0;
    }
}