import React from "react";
import { Menu } from "antd";
import  "./Header.css";
const Header = () => {
  const menus = [
    { name: "IService" },
    { name: "Post a task" },
    { name: "Become an expert" },
    { name: "Find tasks" },
    { name: "How it works" },
    { name: "Sign in" },
  ];
  const renderMenus = () => {
    return menus.map((item) => (
      <Menu.Item style={{ marginRight: "2vw" }} key={item.name} class={item.name}>
        {item.name}
      </Menu.Item>
    ));
  };
  return (
    <Menu
      mode="horizontal"
      style={{
        display: "flex",
        justifyContent: "center",
        margin:"8px"
      }}
    >
      {renderMenus()}
    </Menu>
  );
};

export default Header;
