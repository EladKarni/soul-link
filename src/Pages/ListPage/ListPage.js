import React, { useState, useEffect } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';
import { useParams } from 'react-router-dom';
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

  const { listID } = useParams();

  const { getPokemonByName } = new Pokedex();

  const handleSubmit = async (event) => {
    const pokeInfo = await Promise.all(
      selected.map(async ({ name: pokemonName }, index) => {
        console.log(index, event);
        const { name, types, sprites } = await getPokemonByName(
          pokemonName,
        );
        return {
          name,
          sprites,
          types: types.reverse(),
          nickname: 'Edit Me',
        };
      }),
    );

    firebase.firestore().collection(listID).add({ title: 'Click To Edit Title', pokemon: pokeInfo, id: '' }).then((docRef) => {
      const { id } = docRef;
      setMasterlist([
        ...masterlist,
        {
          pokemon: pokeInfo,
          id,
        },
      ]);
      firebase.firestore().collection(listID).doc(id).update({
        id,
      })
        .then(() => {
          console.log('Document successfully updated!');
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error('Error updating document: ', error);
        });
      setSelected([]);
    });
  };

  const handleChange = (event) => {
    setSelected(event);
  };

  const handleUnLinking = (id) => {
    console.log(id);
    const newMasterList = masterlist.filter((pair) => pair.id !== id);
    const newFilteredList = filteredList?.filter((pair) => pair.id !== id);
    setMasterlist([...newMasterList]);
    setFilteredList(newFilteredList);

    firebase.firestore().collection(listID).doc(id).delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
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
        dataset.pokemon.forEach(({ name, types, nickname }) => {
          if (!isMatch && name.indexOf(trimmedValue) > -1) {
            isMatch = true;
          }

          console.log(nickname.toLowerCase(), trimmedValue);
          if (!isMatch && nickname.toLowerCase().indexOf(trimmedValue) > -1) {
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
    const unlistener = firebase
      .firestore()
      .collection(listID)
      .onSnapshot((snap) => {
        const data = snap.docs.map((doc) => doc.data());
        setMasterlist(data);
      });
    return unlistener;
  }, [listID]);

  return (
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
  );
}

export default ListPage;
