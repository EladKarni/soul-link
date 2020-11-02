import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import firebase from 'firebase';
import styles from './PokeCard.module.scss';
import Editable from '../Editable/Editable';

const PokeCard = (props) => {
  const { card, unlinked } = props;
  const [title, setTitle] = useState('');
  const [nickname, setNickname] = useState([]);
  const { listID } = useParams();

  const titleSubmit = (e, value) => {
    firebase.firestore().collection(listID).doc(card.id).update({ title: value });
  };

  const nickSubmit = (e, value, index) => {
    firebase
      .firestore()
      .runTransaction(async (transaction) => {
        let document = await transaction.get(
          firebase
            .firestore()
            .doc(`${listID}/${card.id}`),
        );
        document = document.data();
        document.pokemon[index].nickname = value;
        transaction.update(
          firebase
            .firestore()
            .doc(`${listID}/${card.id}`),
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
    <Tilt
      className={styles.parallaxEffect}
      tiltMaxAngleX={2}
      tiltMaxAngleY={2}
      tiltReverse
      transitionSpeed={2500}
      perspective={500}
    >

      <div className={styles.card}>
        <div className={styles.title}>
          {title.length > 0
            ? (
              <Editable
                text={title}
                placeholder={card.title}
                type="input"
                cssStyle={styles.inlineInput}
                listCode={listID}
                changeText={changeTitle}
                cardID={card.id}
                syncFunc={titleSubmit}
              />
            )
            : null }
        </div>
        <div className={styles.sprite}>
          <div className={styles.circle} />
          {card.pokemon.map(({ sprites }) => (
            <img
              key={sprites.front_default}
              src={sprites.front_default}
              alt="pokemon-sprite"
            />
          ))}
        </div>
        <div className={styles.infoGroup}>
          {card.pokemon.map(({ name: pokemon, types }, index) => (
            <div className={styles.info} key={pokemon}>
              <div className={styles.nickname}>
                {nickname[index]?.length > 0
                  ? (
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
                    />
                  )
                  : null}
              </div>
              <div className={styles.name}>{pokemon}</div>
              <div className={styles.types}>
                {types.map(({ type: { name: Poketype } }) => (
                  <span className={[`${styles.typeTag}`, Poketype].join(' ')} key={Poketype}>
                    {Poketype}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
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
      </div>
    </Tilt>
  );
};

PokeCard.propTypes = {
  card: PropTypes.object.isRequired,
  unlinked: PropTypes.func.isRequired,
};

export default PokeCard;
