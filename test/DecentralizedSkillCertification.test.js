const { expect } = require("chai");

describe("DecentralizedSkillCertification", function () {
  let certification;
  let owner;
  let issuer;
  let recipient;

  beforeEach(async function () {
    [owner, issuer, recipient] = await ethers.getSigners();
    const DecentralizedSkillCertification = await ethers.getContractFactory("DecentralizedSkillCertification");
    certification = await DecentralizedSkillCertification.deploy();
    await certification.deployed();
  });

  it("Should issue a certification", async function () {
    await certification.connect(issuer).issueCertification(recipient.address, "Solidity", "Advanced");
    const cert = await certification.getCertificationById(0);
    expect(cert.skill).to.equal("Solidity");
    expect(cert.level).to.equal("Advanced");
    expect(cert.issuer).to.equal(issuer.address);
    expect(cert.recipient).to.equal(recipient.address);
  });
});
