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
    const punchTxn = await punchContract
      .connect(randomPerson)
      .punch('A random message!');
    await punchTxn.wait();
  }

  // Owner punches 8 times
  for (let i = 0; i < 8; i++) {
    const punchTxn = await punchContract.punch('Another random message!');
    await punchTxn.wait();
  }

  console.log('Owner address:', owner.address);
  const ownerPunches = await punchContract.getPunchesNumberByAddress(
    owner.address
  );
  console.log('Owner punches:', ownerPunches.toNumber());

  console.log('Stranger address:', randomPerson.address);
  const strangerPunches = await punchContract.getPunchesNumberByAddress(
    randomPerson.address
  );
  console.log('Stranger punches:', strangerPunches.toNumber());

  punchCount = await punchContract.getTotalPunches();

  const allPunches = await punchContract.getAllPunches();
  console.log(allPunches);
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
