import React, { useEffect, useState } from 'react';
// import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import 'react-bootstrap-typeahead/css/Typeahead.css';
import PropTypes from 'prop-types';

import styles from './SearchBar.module.scss';

const SearchBar = ({ change, selected, submit }) => {
  const typeaheadRef = React.useRef(null);
  const [data, setData] = useState([]);

  const typeaheadProps = {
    onChange: (selectedPoke) => {
      change(selectedPoke);
    },
    id: 'autoComplete',
    clearButton: true,
    labelKey: 'name',
    multiple: true,
    minLength: 3,
    bsSize: 'large',
    ref: typeaheadRef,
    placeholder: 'Choose Your Pokémon...',
    style: { borderRadius: '10px 0 0 10px' },
    options: data,
  };

  useEffect(() => {
    const getPokemonAPI = async () => {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=1000',
      );
      const json = await response.json();
      setData(json.results);
    };
    getPokemonAPI();
  }, []);
  return (
    <div className={styles.searchBar} id={styles.search}>
      <Typeahead className={styles.typeahead} {...typeaheadProps} />
      <Button
        className={styles.btn_OutlineSecondary}
        disabled={selected.length !== 2}
        onClick={() => {
          submit();
          typeaheadRef.current.clear();
        }}
      >
        Bind
      </Button>
    </div>
  );
};

SearchBar.propTypes = {
  change: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  submit: PropTypes.func.isRequired,
};

export default SearchBar;
