import React from "react";
import { Button } from "@web3uikit/core";

function Timer(props) {
  const seconsPlusString = props.seconds + " secons";

  return (
    <div
      style={{
        // display: "inline-block",
        // width: "50%",
        margin: "10px",
      }}
    >
      <Button
        onClick={function noRefCheck() {}}
        text={seconsPlusString}
        theme="outline"
      />{" "}
    </div>
  );
}

export default Timer;
