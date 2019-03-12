import React from "react";

const ChannelsPickToolbar = ({ toolbar }) => {
  // console.log("ChannelsPickToolbar", toolbar);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${toolbar.length}, 1fr)`
      }}
    >
      {toolbar &&
        toolbar.map((channel, i) => {
          return <div key={i}>{channel.name}</div>;
        })}
    </div>
  );
};

export default ChannelsPickToolbar;
