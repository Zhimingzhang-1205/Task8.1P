import React from "react";
import { Image } from "antd";
import { image } from "faker";
const Banner = () => {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        maxHeight: "40vh",
        overflow: "hidden",
      }}
    >
      <Image width="60%" src={image.city()} />
    </div>
  );
};

export default Banner;
