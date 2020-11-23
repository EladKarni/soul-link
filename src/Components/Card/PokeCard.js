import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import firebase from '../../Config/Firebase';
import styles from './PokeCard.module.scss';
import Editable from '../Editable/Editable';
import SearchBar from '../SearchBar/SearchBar';

const PokeCard = (props) => {
  const {
    card, unlinked, revived,
  } = props;
  const [title, setTitle] = useState('');
  const [nickname, setNickname] = useState([]);
  const { listID } = useParams();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleSubmit = () => {
    console.log('Card ID', card.id, 0);
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const titleSubmit = (e, value) => {
    firebase.firestore().collection('soul-list').doc(listID).collection('linked-poke-list')
      .doc(card.id)
      .update({ title: value });
  };

  const nickSubmit = (e, value, index) => {
    firebase
      .firestore()
      .runTransaction(async (transaction) => {
        let document = await transaction.get(
          firebase
            .firestore()
            .doc(`soul-list/${listID}/linked-poke-list/${card.id}`),
        );
        document = document.data();
        document.pokemon[index].nickname = value;
        transaction.update(
          firebase
            .firestore()
            .doc(`soul-list/${listID}/linked-poke-list/${card.id}`),
          {
            pokemon: document.pokemon,
            last_updated: new Date().getTime(),
          },
        );
      });
  };

  const changeNickname = (value, index) => {
    setNickname(
      nickname.map((n, i) => {
        if (i !== index) return n;
        return value;
      }),
    );
  };

  const changeTitle = (value) => {
    setTitle(value);
  };

  useEffect(() => {
    setNickname(card.pokemon.map((poke) => poke.nickname));
    setTitle(card.title);
  }, [card]);

  return (
    <>
      <Tilt
        className={styles.parallaxEffect}
        tiltMaxAngleX={card.dead ? 0 : 2}
        tiltMaxAngleY={card.dead ? 0 : 2}
        tiltReverse
        transitionSpeed={2500}
        perspective={500}
      >

        <div className={!card.dead ? styles.card : `${styles.rip}`}>
          {card.dead && (
          <div aria-hidden="true" role="button" onClick={() => revived(card.id)} className={styles.ripLabel}>
            R.I.P
          </div>
          )}
          <div className={styles.title}>
            <Editable
              text={title}
              placeholder={card.title}
              type="input"
              cssStyle={styles.inlineInput}
              listCode={listID}
              changeText={changeTitle}
              cardID={card.id}
              dead={card.dead}
              syncFunc={titleSubmit}
            />
          </div>
          <div className={styles.sprite}>
            <div className={styles.circle} />
            {card.pokemon.map(({ sprites }, index) => (
              <img
                key={sprites.front_default}
                src={sprites.front_default}
                alt="pokemon-sprite"
                aria-hidden="true"
                onClick={() => handleShow(index)}
              />
            ))}
          </div>
          <div className={styles.infoGroup}>
            {card.pokemon.map(({ name: pokemon, types }, index) => (
              <div className={styles.info} key={pokemon}>
                <div className={styles.nickname}>
                  <Editable
                    text={nickname[index]}
                    placeholder={card.nickname}
                    type="input"
                    cssStyle={styles.nickname}
                    listCode={listID}
                    changeText={changeNickname}
                    cardID={card.id}
                    syncFunc={nickSubmit}
                    index={index}
                    dead={card.dead}
                  />
                </div>
                <div className={styles.name}>{pokemon}</div>
                <div className={styles.types}>
                  {types.sort((a, b) => a.slot - b.slot).map(({ type: { name: Poketype } }) => (
                    <span className={[`${styles.typeTag}`, Poketype].join(' ')} key={Poketype}>
                      {Poketype}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {!card.dead
        && (
        <div className={styles.unlink}>
          <button
            type="button"
            onClick={() => {
              unlinked(card.id);
            }}
          >
            Destroy Link
          </button>
        </div>
        )}
        </div>
      </Tilt>
      <Modal show={show} animation={false} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <SearchBar listID={listID} extraData={card.pokemon} required={1} />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

PokeCard.propTypes = {
  card: PropTypes.object.isRequired,
  unlinked: PropTypes.func.isRequired,
  revived: PropTypes.func.isRequired,
};

export default PokeCard;
