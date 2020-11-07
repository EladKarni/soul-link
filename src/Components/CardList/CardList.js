import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import PokeCard from '../Card/PokeCard';

import styles from './CardList.module.scss';

const CardList = ({ list, unlink }) => (
  <DragDropContext onDragEnd={(result) => console.log(result)}>
    <Droppable droppableId="partyList">
      {(provided) => (
        <CardGroup
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
            />
          ))}
          {provided.placeholder}
        </CardGroup>
      )}
    </Droppable>
    <CardGroup className={styles.boxList}>
      {list.map((pair, index) => (
        <PokeCard
          cIndex={index}
          card={list[index]}
          unlinked={unlink}
          key={pair.id}
        />
      ))}
    </CardGroup>
  </DragDropContext>
);

CardList.propTypes = {
  list: PropTypes.array.isRequired,
  unlink: PropTypes.func.isRequired,
};

export default CardList;
