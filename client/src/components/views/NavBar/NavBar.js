import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon, Input, Form } from "antd";
import { Search } from "react-feather";
import "./Sections/Navbar.css";
import { useHistory } from "react-router-dom";

function NavBar() {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const history = useHistory();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/search?q=${searchTerm}`);
    window.location.reload();
  };

  return (
    <nav
      className="menu"
      style={{ position: "fixed", zIndex: 5, width: "100%" }}
    >
      <div className="menu__logo">
        <a href="/">
          <img
            style={{ marginTop: "-10px" }}
            width="55px"
            height="55px"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNcRSERI5wHLIpYQXTyRbRPtZV4Hyf3rSoYw&usqp=CAU"
            alt="logo"
          />
        </a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
      <form id="search-form" onSubmit={(e) => handleSearch(e)}>
        <Input
          id="search-input"
          placeholder="Search movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button id="search-icon" type="submit">
          <Search />
        </button>
      </form>
    </nav>
  );
}

export default NavBar;
