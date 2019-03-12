import React from "react";

const ChannelsPickRow = ({ cols }) => {
  // console.log("ChannelsPickRow", cols);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols.length}, 1fr)`
      }}
    >
      {cols &&
        cols.map((channel, i) => {
          return <div key={i}>{channel.name}</div>;
        })}
    </div>
  );
};

export default ChannelsPickRow;
