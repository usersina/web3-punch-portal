const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const punchContractFactory = await hre.ethers.getContractFactory(
    'PunchPortal'
  );
  const punchContract = await punchContractFactory.deploy();
  await punchContract.deployed();

  console.log('Contract deployed to:', punchContract.address);
  console.log('Contract deployed by:', owner.address);

  let punchCount = await punchContract.getTotalPunches();

  // Random person punches 5 times
  for (let i = 0; i < 5; i++) {
    const punchTxn = await punchContract.connect(randomPerson).punch();
    await punchTxn.wait();
  }

  // Owner punches 8 times
  for (let i = 0; i < 8; i++) {
    const punchTxn = await punchContract.punch();
    await punchTxn.wait();
  }

  console.log('Owner address:', owner.address);
  const ownerPunches = await punchContract.getPunchesByAddress(owner.address);
  console.log('Owner punches:', ownerPunches);

  console.log('Stranger address:', randomPerson.address);
  const strangerPunches = await punchContract.getPunchesByAddress(
    randomPerson.address
  );
  console.log('Stranger punches:', strangerPunches);

  punchCount = await punchContract.getTotalPunches();
};

(async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
