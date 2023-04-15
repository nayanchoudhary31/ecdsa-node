import { useState } from "react";
import server from "./server";
import { sign } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer() {
  const [walletAddress, setWalletAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance, transactions },
      } = await server.post(`send`, {
        sender: walletAddress,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        recoverBit: signature[0],
      });
    } catch (ex) {
      alert(ex.response.data);
    }
  }
  return (
    <form
      className="container transfer"
      onSubmit={(e) => {
        transfer(e);
      }}
    >
      <h1>Transfer Amount </h1>

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
          placeholder="Type an address for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <label>
        Signature
        <input
          placeholder="0x123abc...."
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
