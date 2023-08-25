const { ethers } = require("hardhat")
const endpoints = require("./endpoints")

// should be deployed on goerli / mainnet
async function main() {
    const REMOTE_NETWORK = process.env.TESTNET === "1" ? "GOERLI" : "MAINNET"
    const DEPLOYER = process.env.TESTNET === "1" ? "DEPLOYER_TESTNET" : "DEPLOYER_MAINNET"

    const [deployer] = await ethers.getSigners()
    if (deployer.address !== process.env[DEPLOYER]) throw Error("deployer address is not correct")
    const chainId = await deployer.getChainId()
    if (chainId != process.env[`CHAIN_ID_${REMOTE_NETWORK}`]) throw Error(" chainId is not correct")

    const name = "OpenBlox Token"
    const symbol = "OBX"
    const sharedDecimals = 0
    const remoteEndpoint = endpoints[`ENDPOINT_${REMOTE_NETWORK}`]

    // deploy
    const OFTV2 = await ethers.getContractFactory("OFTV2")
    const remoteOFT = await OFTV2.connect(deployer).deploy(name, symbol, sharedDecimals, remoteEndpoint)
    await remoteOFT.deployed()
    console.log(`2-1: ${REMOTE_NETWORK} ProxyOFTV2 deployed to`, remoteOFT.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
