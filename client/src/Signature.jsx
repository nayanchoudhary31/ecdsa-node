import { useState } from "react";
import server from "./server";
import { sign } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, utf8ToBytes } from "ethereum-cryptography/utils";

function Signature() {
  const [walletAddress, setWalletAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function getSignature(privateKey, event) {
    try {
      event.preventDefault();
      const {
        data: { transactionId },
      } = await server.get(`transaction/${walletAddress}`);
      const txDetails = JSON.stringify({
        sender: walletAddress,
        amount: sendAmount,
        recipient: recipient,
        nonce: transactionId + 1,
      });
      const hashedData = keccak256(utf8ToBytes(txDetails));
      const _privateKey = hexToBytes(privateKey);
      const sig = await sign(hashedData, _privateKey, { recovered: true });
      setSignature(sig[0].toString());
      setRecoveryBit(sig[1].toString());
    } catch (error) {
      console.log("🚀 ~ file: Transfer.jsx:40 ~ getSignature ~ error:", error);
    }
  }

  return (
    <form
      className="container transfer"
      onSubmit={(e) => {
        getSignature(privateKey, e);
      }}
    >
      <h1>Sign Transaction</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address for example: 0x1"
          value={walletAddress}
          onChange={setValue(setWalletAddress)}
        ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Type an address, for example: 0x3"
          value={privateKey}
          type="password"
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>
      <div
        className="sig"
        onClick={() => {
          navigator.clipboard.writeText(signature);
        }}
      >
        Signature:{signature}
      </div>
      <div className="recoveryBit">RecoveryBit:{recoveryBit}</div>

      <input type="submit" className="button" value="Generate Signature" />
    </form>
  );
}

export default Signature;
