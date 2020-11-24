import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import PropTypes from 'prop-types';
import firebase from '../../Config/Firebase';
import styles from './SearchBar.module.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import GetPokemonFromPokeAPI from '../../Util/PokeAPI';

const SearchBar = ({
  listID, required, extraData, pokeIndex, closeModal,
}) => {
  const typeaheadRef = React.useRef(null);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleSubmit = async () => {
    const pokeInfo = await GetPokemonFromPokeAPI(selected);

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

  const handleEvolve = async () => {
    const pokeInfo = await GetPokemonFromPokeAPI(selected);

    let newPokeCard = [];
    const oldPokemon = extraData.pokemon.filter((pokemon, index) => index !== pokeIndex)[0];
    const newEvolution = { ...pokeInfo[0], nickname: extraData.pokemon[pokeIndex].nickname };

    if (!pokeIndex) {
      newPokeCard = [
        newEvolution,
        oldPokemon,
      ];
    } else {
      newPokeCard = [
        oldPokemon,
        newEvolution,
      ];
    }

    firebase.firestore().collection('soul-list').doc(listID).collection('linked-poke-list')
      .doc(extraData.id)
      .update({ pokemon: newPokeCard })
      .then(closeModal())
      .catch((err) => err);
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

  const handleSwitch = () => {
    if (required === 1) {
      handleEvolve();
    } else {
      handleSubmit();
    }
    typeaheadRef.current.clear();
  };

  return (
    <div className={styles.searchBar} id={styles.search}>
      <Typeahead className={styles.typeahead} {...typeaheadProps} />
      <Button
        className={styles.btn_OutlineSecondary}
        disabled={selected.length !== required}
        onClick={() => handleSwitch()}
      >
        Bind
      </Button>
    </div>
  );
};

SearchBar.defaultProps = {
  pokeIndex: -1,
  extraData: {},
  closeModal: null,
};

SearchBar.propTypes = {
  listID: PropTypes.string.isRequired,
  required: PropTypes.number.isRequired,
  pokeIndex: PropTypes.number,
  extraData: PropTypes.object,
  closeModal: PropTypes.func,
};

export default SearchBar;
