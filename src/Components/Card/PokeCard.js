import React from 'react';
// import { useParams } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import PropTypes from 'prop-types';
import styles from './PokeCard.module.scss';

const PokeCard = (props) => {
  const { pair, unlinked } = props;
  console.log(pair.pokemon);
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
          <h2>Title</h2>
        </div>
        <div className={styles.sprite}>
          <div className={styles.circle} />
          {pair.pokemon.map(({ sprites }) => (
            <img
              key={sprites.front_default}
              src={sprites.front_default}
              alt="pokemon-sprite"
            />
          ))}
        </div>
        <div className={styles.infoGroup}>
          {pair.pokemon.map(({ name: pokemon, types }) => (
            <div className={styles.info} key={pokemon}>
              <h1 className={styles.nickname}>
                nickname
              </h1>
              <div className={styles.name}>{pokemon}</div>
              <div className={styles.types}>
                {types.map(({ type: { name: Poketype } }) => (
                  <span className={[`${styles.typeTag}`, Poketype].join(' ')} key={Poketype}>
                    {Poketype}
                    {console.log(Poketype)}
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
              unlinked(pair.id);
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
  pair: PropTypes.object.isRequired,
  unlinked: PropTypes.func.isRequired,
};

export default PokeCard;
