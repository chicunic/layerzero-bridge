const { ethers } = require("hardhat")
const endpoints = require("./endpoints")

// should be deployed on fuji / avax
async function main() {
    const LOCAL_NETWORK = process.env.TESTNET === "1" ? "FUJI" : "AVAX"
    const DEPLOYER = process.env.TESTNET === "1" ? "DEPLOYER_TESTNET" : "DEPLOYER_MAINNET"

    const [deployer] = await ethers.getSigners()
    if (deployer.address !== process.env[DEPLOYER]) throw Error("deployer address is not correct")
    const chainId = await deployer.getChainId()
    if (chainId != process.env[`CHAIN_ID_${LOCAL_NETWORK}`]) throw Error(" chainId is not correct")

    const token = process.env[`TOKEN_${LOCAL_NETWORK}`]
    const sharedDecimals = 0
    const localEndpoint = endpoints[`ENDPOINT_${LOCAL_NETWORK}`]

    // deploy
    const ProxyOFTV2 = await ethers.getContractFactory("ProxyOFTV2")
    const localOFT = await ProxyOFTV2.connect(deployer).deploy(token, sharedDecimals, localEndpoint)
    await localOFT.deployed()
    console.log(`1-1: ${LOCAL_NETWORK} ProxyOFTV2 deployed to`, localOFT.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
