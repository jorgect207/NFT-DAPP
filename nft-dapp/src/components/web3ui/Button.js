import { Button } from "@web3uikit/core";
import React from "react";

const Connectbutton = (props) => {
  return (
    <div
      style={{
        margin: "5px",
        padding: "5px",
      }}
    >
      <Button text={props.text} onClick={props.onClick}></Button>
    </div>
  );
};

export default Connectbutton;
