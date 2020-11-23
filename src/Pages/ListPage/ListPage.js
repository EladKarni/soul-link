import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import firebase from '../../Config/Firebase';
import CardList from '../../Components/CardList/CardList';
import SearchBar from '../../Components/SearchBar/SearchBar';
import Header from '../../Components/Header/Header';

import styles from './ListPage.module.scss';

function ListPage() {
  const [filter, setFilter] = useState('');
  const [masterlist, setMasterlist] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const { listID } = useParams();
  const history = useHistory();

  const handleUnLinking = (id) => {
    firebase.firestore().collection('soul-list').doc(listID).collection('linked-poke-list')
      .doc(id)
      .update({ dead: true })
      .catch((error) => error);
  };

  const handleRevive = (id) => {
    firebase.firestore().collection('soul-list').doc(listID).collection('linked-poke-list')
      .doc(id)
      .update({ dead: false })
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
            <SearchBar listID={listID} required={2} />
          </div>
          { masterlist.length <= 0 ? ''
            : (
              <div className={styles.pokeList}>
                <CardList
                  list={filteredList.length > 0 ? filteredList : masterlist}
                  unlink={handleUnLinking}
                  revive={handleRevive}
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
}

export default ListPage;
