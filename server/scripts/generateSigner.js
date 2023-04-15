const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKeys = secp.utils.randomPrivateKey();
const publicKeys = secp.getPublicKey(privateKeys);
const walletAddress = keccak256(publicKeys.slice(1)).slice(-20);

console.log(`Private Keys: ${toHex(privateKeys)}`);
console.log(`Public Keys: ${toHex(publicKeys)}`);
console.log(`Wallet Address: 0x${toHex(walletAddress)}`);
