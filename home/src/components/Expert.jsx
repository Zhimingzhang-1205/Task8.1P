import React from "react";
import classes from "./Expert.module.css";

import { Rate, Card } from "antd";
const Expert = ({ expert }) => {
  return (
    <Card className={classes.expert}>
      <img src={expert.image} alt="" />
      <h3>{expert.name}</h3>
      <p>{expert.description}</p>
      <p>
        <Rate disabled defaultValue={expert.rate} />
      </p>
    </Card>
  );
};

export default Expert;
