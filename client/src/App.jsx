import Wallet from "./Wallet";
import Signature from "./Signature";
import "./App.scss";
import { useState } from "react";
import Transfer from "./Transfer";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Signature />
      <Transfer />
    </div>
  );
}

export default App;
