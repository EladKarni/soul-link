import React, { useEffect, useState } from "react";
// import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
// import InputGroup from 'react-bootstrap/InputGroup';
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import "react-bootstrap-typeahead/css/Typeahead.css";

import styles from "./SearchBar.module.scss";

const SearchBar = props => {
  let typeaheadRef = React.useRef(null);
  const [data, setData] = useState([]);
   
  const typeaheadProps = {
    onChange: selected => {
      props.change(selected);
    },
    id: "autoComplete",
    clearButton: true,
    labelKey: "name",
    multiple: true,
    minLength: 3,
    bsSize: "large",
    ref: typeaheadRef,
    placeholder: "Choose Your Pokémon...",
    style: { borderRadius: "10px 0 0 10px" },
    options: data
  };

  useEffect(() => {
		const getPokemonAPI = async () => {
			const response = await fetch(
				'https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=1000'
			)
			const json = await response.json()
			setData(json.results)
		}
		getPokemonAPI()
    }, [])

  return (
    <div className={styles.searchBar} id={styles.search}>
      <Typeahead className={styles.typeahead} {...typeaheadProps} />
      <Button
        className={styles.btn_OutlineSecondary}
        disabled={props.selected.length !== 2}
        onClick={() => {
          props.submit();
          typeaheadRef.current.clear();
        }}
      >
        Bind
      </Button>
    </div>
  );
};

export default SearchBar;
