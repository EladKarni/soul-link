import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import { Pokedex } from 'pokeapi-js-wrapper';
import PropTypes from 'prop-types';
import firebase from '../../Config/Firebase';
import styles from './SearchBar.module.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const SearchBar = ({ listID }) => {
  const typeaheadRef = React.useRef(null);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);

  const { getPokemonByName } = new Pokedex();

  const handleSubmit = async () => {
    const pokeInfo = await Promise.all(
      selected.map(async ({ name: pokemonName }) => {
        const { name, types, sprites } = await getPokemonByName(
          pokemonName,
        );
        return {
          name,
          sprites,
          types: types.sort((a, b) => a.slot - b.slot),
          nickname: 'Edit Me',
        };
      }),
    );

    firebase.firestore().collection('soul-list')
      .doc(listID).collection('linked-poke-list')
      .add({ title: 'Click To Edit Title', pokemon: pokeInfo, id: '' })
      .then((docRef) => {
        const { id } = docRef;
        firebase.firestore().collection('soul-list')
          .doc(listID).collection('linked-poke-list')
          .doc(id)
          .update({
            id,
          })
          .then(() => 'Success')
          .catch((error) => error);
        setSelected([]);
      });
  };

  const handleChange = (event) => {
    setSelected(event);
  };
  const typeaheadProps = {
    onChange: (selectedPoke) => {
      handleChange(selectedPoke);
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
          handleSubmit();
          typeaheadRef.current.clear();
        }}
      >
        Bind
      </Button>
    </div>
  );
};

SearchBar.propTypes = {
  listID: PropTypes.string.isRequired,
};

export default SearchBar;
