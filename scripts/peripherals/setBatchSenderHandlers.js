const hre = require("hardhat")

const handlers = {
  "0x5384E6cAd96B2877B5B3337A277577053BD1941D": true
};

function getArbValues() {
  return {
    batchSenderAddress: "0x5384E6cAd96B2877B5B3337A277577053BD1941D"
  }
}

function getValues() {
  if (hre.network.name === "arbitrum") {
    return getArbValues();
  }

  throw new Error(`Unsupported network ${hre.network.name}`);
}

async function main() {
  const { batchSenderAddress } = getValues();
  const batchSender = await hre.ethers.getContractAt("BatchSender", batchSenderAddress);

  for (const [address, isHandler] of Object.entries(handlers)) {
    const onchainIsHandler = await batchSender.isHandler(address);
    if (isHandler !== onchainIsHandler) {
      console.log("%s handler %s", isHandler ? "adding" : "removing", address);
      const tx = await batchSender.setHandler(address, isHandler);
      console.log("done tx: %s", tx.hash);
    }
  }
  console.log("done")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
