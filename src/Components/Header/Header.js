import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import PropTypes from 'prop-types';

import './Header.scss';

const Header = ({
  filterText, disabledInput, change,
}) => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="/" id="logo">
      {' Soul-Link PokeApp'}
    </Navbar.Brand>
    <Form inline onSubmit={(e) => e.preventDefault()}>
      <FormControl
        className="search-input"
        type="text"
        id="searchInput"
        placeholder="Title, Nickname, Pokemon, or Type..."
        value={filterText}
        disabled={disabledInput}
        onChange={change}
      />
    </Form>
  </Navbar>
);

Header.propTypes = {
  filterText: PropTypes.string.isRequired,
  disabledInput: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
};

export default Header;
