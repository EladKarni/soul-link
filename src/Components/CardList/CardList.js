import React from "react";
import PokeCard from "../Card/PokeCard";
import CardGroup from "react-bootstrap/CardGroup";

import "./CardList.scss";

const CardList = props => {
  return (
    <CardGroup className="card-group">
      {props.list.map((pair, index) => {
        return (
            <PokeCard
              change={props.onChange}
              i={index}
              pair={props.list[index]}
              unlinked={props.unlink}
              key={pair.id}
            />
        );
      })}
    </CardGroup>
  );
};

export default CardList;
