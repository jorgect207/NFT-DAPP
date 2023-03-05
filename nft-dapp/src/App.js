import React, { useEffect, useState } from "react";
import Card from "./components/UI/Card";
import Connectbutton from "./components/web3ui/Connectbutton";
import Cardmint from "./components/web3ui/Cardnft";
import Button from "./components/web3ui/Button";
import Timer from "./components/Timer";

import useTimer from "./components/hook/useTimer";
import useWeb3Connection from "./components/hook/useWeb3Connection";
var log = require("loglevel");

function App() {
  const [publicMint, setPublicMint] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const {
    withdrawMoney,
    changeStateToPublic,
    stopContract,
    mintPrivateNft,
    mintPublicNft,
    gettingOwner,
    gettingState,
    account,
  } = useWeb3Connection();

  const seconds = useTimer(10);

  async function mint() {
    const state = await gettingState();
    if (state.toString() === "1") {
      await mintPrivateNft();
    } else {
      await mintPublicNft();
    }
  }

  const tittle = publicMint && seconds > 0 ? "Whitelisted Mint" : "Public Mint";

  useEffect(() => {
    async function gettingUserWallet() {
      const ownerAddress = await gettingOwner();
      log.warn(ownerAddress);
      log.warn(account);
      if (ownerAddress.toString().toLowerCase() === account.toString()) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }
    gettingUserWallet();
  }, [account]);

  return (
    <React.Fragment>
      <Card>
        <Connectbutton></Connectbutton>
      </Card>
      <Card>
        {!isOwner ? (
          <Button text="Click in the card below to mint"></Button>
        ) : (
          <React.Fragment>
            <Button text="Start Public" onClick={changeStateToPublic}></Button>
            <Button text="Stop!" onClick={stopContract}></Button>
          </React.Fragment>
        )}
      </Card>
      <Card>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Cardmint
            onClick={mint}
            description="Click to mint 1 Nft"
            title={tittle}
            text="if you are in the WL you can mint"
          ></Cardmint>
          {publicMint && seconds > 0 && <Timer seconds={seconds}></Timer>}
        </div>
      </Card>
    </React.Fragment>
  );
}

export default App;
