async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const DecentralizedSkillCertification = await ethers.getContractFactory("DecentralizedSkillCertification");
  const certification = await DecentralizedSkillCertification.deploy();
  await certification.deployed();

  console.log("DecentralizedSkillCertification deployed to:", certification.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
