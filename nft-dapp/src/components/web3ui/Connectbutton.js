import { ConnectButton } from "@web3uikit/web3";
import React from "react";
import classes from "./Connectbutton.module.css";

const Connectbutton = (props) => {
  return (
    <div className={classes.div}>
      <ConnectButton></ConnectButton>
    </div>
  );
};

export default Connectbutton;
