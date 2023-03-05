import { Card } from "@web3uikit/core";
import React from "react";
import { Illustration } from "@web3uikit/core";

const Cardmint = (props) => {
  return (
    <div
      style={{
        width: "250px",
      }}
    >
      <Card
        description={props.description}
        onClick={props.onClick}
        title={props.title}
        tooltipText={props.text}
      >
        <div>
          <Illustration height="180px" logo="servers" width="100%" />
        </div>
      </Card>
    </div>
  );
};

export default Cardmint;
