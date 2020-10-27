import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

import "./Header.scss";

const Header = props => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">
        {" Soul-Link PokeApp"}
      </Navbar.Brand>
      {props.code !== "" ? props.code : null}
      <Form inline onSubmit={(e) => e.preventDefault()}>
        <FormControl
          className="search-input"
          type="text"
          placeholder="Search for Nickname, Pokemon, or Type"
          value={props.filterText}
          disabled={props.disabledInput}
          onChange={props.change}
        />
      </Form>
    </Navbar>
  );
};

export default Header;
