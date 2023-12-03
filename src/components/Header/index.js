import React from "react";

import { Menu } from "@mui/icons-material";
import { Avatar } from "@mui/material";

import "./styles.css";

export const Header = ({ OpenSidebar }) => {
  return (
    <header className="header">
      <div className="menu-icon">
        <Menu className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        {/* <BsSearch className="icon" /> */}
      </div>
      <div className="header-right">
        <Avatar alt="user-name" src="" />
      </div>
    </header>
  );
};
