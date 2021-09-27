import React from "react";

const Rate = ({ amount = 5 }) => {
  const renderStars = () => {
    return new Array(amount).fill(1).map(() => {
      return <span style={{ color: "yellow", fontSize: "1.5vw" }}>★</span>;
    });
  };
  return <>{renderStars()}</>;
};

export default Rate;