const endpoints = require("./endpoints")

// should be deployed on arbitrum goerli / arbitrum mainnet
async function main() {
    const REMOTE_NETWORK = process.env.TESTNET === "1" ? "ARBITRUM_GOERLI" : "ARBITRUM_MAINNET"

    const remoteOFT = process.env[`OFT_${REMOTE_NETWORK}`]
    const name = "OpenBlox Token"
    const symbol = "OBX"
    const sharedDecimals = 0
    const remoteEndpoint = endpoints[`ENDPOINT_${REMOTE_NETWORK}`]

    try {
        await run("verify:verify", {
            address: remoteOFT,
            contract: "contracts/token/oft/v2/OFTV2.sol:OFTV2",
            constructorArguments: [name, symbol, sharedDecimals, remoteEndpoint],
        })
    } catch (err) {
        console.error(err.message)
    }
    console.log(`2-2: ${REMOTE_NETWORK} OFTV2 verified at`, remoteOFT)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
