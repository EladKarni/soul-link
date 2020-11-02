import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import PropTypes from 'prop-types';
import PokeCard from '../Card/PokeCard';

import './CardList.scss';

const CardList = ({ list, unlink }) => (
  <CardGroup className="card-group">
    {list.map((pair, index) => (
      <PokeCard
        iCard={index}
        card={list[index]}
        unlinked={unlink}
        key={pair.id}
      />
    ))}
  </CardGroup>
);

CardList.propTypes = {
  list: PropTypes.array.isRequired,
  unlink: PropTypes.func.isRequired,
};

export default CardList;
