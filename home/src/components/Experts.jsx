import React from "react";
import Expert from "./Expert";
import faker from "faker";
const Experts = () => {
  const experts = new Array(Math.ceil(faker.finance.amount(3, 8)))
    .fill(1)
    .map(() => {
      return {
        image: faker.image.animals(250, 100),
        name: faker.name.findName() + " " + faker.name.lastName(),
        description: faker.name.title(),
        rate: faker.finance.account(1, 5),
      };
    });
  const renderExperts = () => {
    return experts.map((expert) => (
      <Expert key={expert.name} expert={expert} />
    ));
  };
  return (
    <div
      style={{
        width: "60%",
        margin: "0 auto",
      }}
    >
      <h1 style={{
          display: "flex",
          justifyContent: "center",
      }}>Featured Experts</h1>
      {renderExperts()}
      <div style={{ clear: "both" }}></div>
    </div>
  );
};

export default Experts;
