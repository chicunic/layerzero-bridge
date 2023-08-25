const { ethers } = require("hardhat")
const endpoints = require("./endpoints")

// should be deployed on goerli / mainnet
async function main() {
    const LOCAL_NETWORK = process.env.TESTNET === "1" ? "FUJI" : "AVAX"
    const REMOTE_NETWORK = process.env.TESTNET === "1" ? "GOERLI" : "MAINNET"
    const DEPLOYER = process.env.TESTNET === "1" ? "DEPLOYER_TESTNET" : "DEPLOYER_MAINNET"

    const [deployer] = await ethers.getSigners()
    if (deployer.address !== process.env[DEPLOYER]) throw Error("deployer address is not correct")
    const chainId = await deployer.getChainId()
    if (chainId != process.env[`CHAIN_ID_${REMOTE_NETWORK}`]) throw Error(" chainId is not correct")

    const localAddress = process.env[`OFT_${LOCAL_NETWORK}`]
    const remoteAddress = process.env[`OFT_${REMOTE_NETWORK}`]
    const localChainId = endpoints[`ENDPOINT_CHAIN_ID_${LOCAL_NETWORK}`]
    // const remoteChainId = endpoints[`ENDPOINT_CHAIN_ID_${REMOTE_NETWORK}`]
    // const remotePath = ethers.utils.solidityPack(["address", "address"], [remoteAddress, localAddress])
    const localPath = ethers.utils.solidityPack(["address", "address"], [localAddress, remoteAddress])

    // deploy
    const remoteOFT = await ethers.getContractAt("OFTV2", remoteAddress)
    await remoteOFT.connect(deployer).setTrustedRemote(localChainId, localPath)
    console.log(`3-2: ${REMOTE_NETWORK} ProxyOFTV2 set trust remote to ${LOCAL_NETWORK}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
