import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import PokeCard from '../Card/PokeCard';

import styles from './CardList.module.scss';

const CardList = ({ list, unlink }) => (
  <Droppable droppableId={list.id}>
    {(provided) => (
      <CardGroup
        key={list.id}
        className={styles.partyList}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {list.slice(0, 6).map((pair, index) => (
          <PokeCard
            cIndex={index}
            card={list[index]}
            unlinked={unlink}
            key={pair.id}
            ref={provided.innerRef}
          />
        ))}
        {provided.placeholder}
      </CardGroup>
    )}
  </Droppable>
);

CardList.propTypes = {
  list: PropTypes.array.isRequired,
  unlink: PropTypes.func.isRequired,
};

export default CardList;
