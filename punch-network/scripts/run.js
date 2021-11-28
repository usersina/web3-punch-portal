const main = async () => {
  const punchContractFactory = await hre.ethers.getContractFactory(
    'PunchPortal'
  );
  const punchContract = await punchContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await punchContract.deployed();
  console.log('Contract address:', punchContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    punchContract.address
  );
  console.log(
    'Initial contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  // Send a punch
  let punchTxn = await punchContract.punch('Punch #1!');
  await punchTxn.wait();

  punchTxn = await punchContract.punch('Punch #2!');
  await punchTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(punchContract.address);
  console.log(
    'Next contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  // const [owner, randomPerson] = await hre.ethers.getSigners();
  // Random person punches 5 times
  // for (let i = 0; i < 5; i++) {
  //   const punchTxn = await punchContract
  //     .connect(randomPerson)
  //     .punch('A random message!');
  //   await punchTxn.wait();
  // }

  // Owner punches 8 times
  // for (let i = 0; i < 8; i++) {
  //   const punchTxn = await punchContract.punch('Another random message!');
  //   await punchTxn.wait();
  // }

  // console.log('Owner address:', owner.address);
  // const ownerPunches = await punchContract.getPunchesNumberByAddress(
  //   owner.address
  // );
  // console.log('Owner punches:', ownerPunches.toNumber());

  // console.log('Stranger address:', randomPerson.address);
  // const strangerPunches = await punchContract.getPunchesNumberByAddress(
  //   randomPerson.address
  // );
  // console.log('Stranger punches:', strangerPunches.toNumber());

  // punchCount = await punchContract.getTotalPunches();

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
