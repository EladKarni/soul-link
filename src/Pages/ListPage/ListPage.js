import React, { useState, useEffect } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';
import { useParams, useHistory } from 'react-router-dom';
import firebase from '../../Config/Firebase';
import CardList from '../../Components/CardList/CardList';
import SearchBar from '../../Components/SearchBar/SearchBar';
import Header from '../../Components/Header/Header';

import styles from './ListPage.module.scss';

function ListPage() {
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState([]);
  const [masterlist, setMasterlist] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const { listID } = useParams();
  const history = useHistory();

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
        setMasterlist([
          ...masterlist,
          {
            pokemon: pokeInfo,
            id,
          },
        ]);
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

  const handleUnLinking = (id) => {
    const newMasterList = masterlist.filter((pair) => pair.id !== id);
    const newFilteredList = filteredList?.filter((pair) => pair.id !== id);

    setMasterlist([...newMasterList]);
    setFilteredList(newFilteredList);

    firebase.firestore().collection('soul-list').doc(listID).collection('linked-poke-list')
      .doc(id)
      .delete()
      .then(() => 'Document successfully deleted!')
      .catch((error) => error);
  };

  const handleFilterList = (event) => {
    const { value } = event.target;
    const trimmedValue = value.toLowerCase().trim();

    const newFilteredList = masterlist
      .map((dataset) => {
        if (trimmedValue === '') {
          return null;
        }

        let isMatch = false;
        dataset.pokemon.forEach(({
          name, types, nickname,
        }) => {
          if (!isMatch && name.indexOf(trimmedValue) > -1) {
            isMatch = true;
          }

          if (!isMatch && nickname.toLowerCase().indexOf(trimmedValue) > -1) {
            isMatch = true;
          }

          if (!isMatch && dataset.title.toLowerCase().indexOf(trimmedValue) > -1) {
            isMatch = true;
          }

          types.forEach(({ type }) => {
            if (!isMatch && type.name.indexOf(trimmedValue) > -1) {
              isMatch = true;
            }
          });
        });

        if (isMatch) {
          return dataset;
        }

        return null;
      }).filter((dataset) => dataset !== null);

    setFilter(value);
    setFilteredList([...newFilteredList]);
  };

  useEffect(() => {
    const doesListExist = firebase.functions().httpsCallable('doesListExist');
    doesListExist(`${listID.slice(3)}`).then((result) => {
      if (result.data) {
        setLoading(false);
      } else {
        history.push('/');
      }
    });

    const unlistener = firebase
      .firestore()
      .collection('soul-list').doc(listID).collection('linked-poke-list')
      .onSnapshot((snap) => {
        const data = snap.docs.map((doc) => doc.data());
        setMasterlist(data);
      });
    return unlistener;
  }, [listID, history]);

  return (
    <>
      {isLoading && (
      <div className={styles.spinnerContainer}>
        <div className={styles.ldsRing}>
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
      )}
      <div className={styles.container}>
        <div className={styles.listPage}>
          <Header
            filterText={filter}
            change={handleFilterList}
            disabledInput={masterlist.length < 2}
          />
          <div className="search-bar">
            <SearchBar
              selected={selected}
              submit={handleSubmit}
              change={handleChange}
            />
          </div>
          { masterlist.length <= 0 ? ''
            : (
              <div className={styles.pokeList}>
                <CardList
                  list={filteredList.length > 0 ? filteredList : masterlist}
                  unlink={handleUnLinking}
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
}

export default ListPage;
