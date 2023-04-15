const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const sepc = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
/**
 * Private Keys: a1f0726e15db4949a04c942b6005a6f2b7022164aaced3282b65a7802825c612
 * Public Keys: 04b33e9019cfd08a740009fa8048cc7796e141ee8635544121d8420f0c7143373ed3fa8f841b45af45163c7314e92e8926456e6d53d66c7d189fb0df8e5d85efcb
 * Wallet Address: 0xcb1cc585f2d15a76ec156e75c8ed4eae7d5d3e19
 */

/**
 * Private Keys: 7ae51d2b9165837cebd19d03ea46fd53b70a18b46fc6b66d785ee6bbcc728800
 * Public Keys: 04f3c83df2bf8f27f2c44dee6397709774582db07aa960ac0610bf0cd8ef1df96a4e221a19d3c66a392e78234912882a1cd29ffa613cd1aded12edd3a4a7b34c91
 * Wallet Address: 0xa23867e8c0a73affbeeaad71b8270166740cadec
 */

/**
 * Private Keys: 25ed0d47336b1ac87955b84caffd0da2ab64348f7fce86e4bf350493b09e1c0f
 * Public Keys: 049b99282f7ce8df7c17a2eba6ee37a02fd08a2a55e85c4eb3ef753c45952fbb2aa9ac1d8c48df7aa73522e471dbf24fc1d89565db589b068a0898ade8cbcf189e
 * Wallet Address: 0x8196a7a3d85207bee0c392739ee20c15fbe79ef7
 */

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
  "0x8196a7a3d85207bee0c392739ee20c15fbe79ef7": 110,
};

let transaction = {
  "0x1": 2,
  "0x2": 3,
  "0x3": 1,
  "0x8196a7a3d85207bee0c392739ee20c15fbe79ef7": 1,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/transaction/:walletAddress", (req, res) => {
  const { walletAddress } = req.params;
  const transactionId = transaction[walletAddress] || 0;
  res.send({ transactionId });
});

app.post("/send", (req, res) => {
  // TODO Get the signature from the client side
  // Revcover the public address from signature
  const { sender, recipient, amount, sig, recoverBit } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const txObject = {
    sender: sender,
    recipient: recipient,
    amount: amount,
    nonce: transaction[sender] + 1,
  };
  const hashedTxObj = keccak256(utf8ToBytes(JSON.stringify(txObject)));
  const pubKey = sepc.recoverPublicKey(
    hashedTxObj,
    Uint8Array.from(sig.split(",")),
    parseInt(recoverBit)
  );
  console.log("🚀 ~ file: index.js:72 ~ app.post ~ pubKey:", pubKey);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    transaction[sender] += 1;
    res.send({ balance: balances[sender], transaction: transaction[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
