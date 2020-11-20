import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import PokeCard from '../Card/PokeCard';

import styles from './CardList.module.scss';

const CardList = ({ list, unlink, idList }) => (
  <Droppable droppableId={`${idList}_Party`} direction="horizontal">
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
      >

        <div style={{
          display: 'flex', justifyContent: 'center', color: 'white', zIndex: 999,
        }}
        >
          <h1>Pokemon In Party</h1>
        </div>
        <CardGroup
          key={list.id}
          className={styles.partyList}
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
      </div>
    )}
  </Droppable>
);

CardList.propTypes = {
  list: PropTypes.array.isRequired,
  unlink: PropTypes.func.isRequired,
  idList: PropTypes.string.isRequired,
};

export default CardList;
