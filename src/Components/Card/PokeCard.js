import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Button from "react-bootstrap/Button";
import firebase from '../../Config/Firebase'
import { useParams } from "react-router-dom";
import Tilt from 'react-parallax-tilt';

import styles from "./PokeCard.module.scss";

const PokeCard = props => {

  const { listID } = useParams();
  const [nickname, setNickname] = useState([]);
  const [editing, setEditing] = useState(null);

  const handleLabelSubmit = (event, index) => {
      if (event.key === "Enter") {
        firebase
          .firestore()
          .runTransaction(async (transaction) => {
            let document = await transaction.get(
              firebase
                .firestore()
                .doc(`${listID}/${props.pair.id}`)
            );
            document = document.data();
            document.pokemon[index].nickname = nickname[index];
            transaction.update(
              firebase
                .firestore()
                .doc(`${listID}/${props.pair.id}`),
              {
                pokemon: document.pokemon,
                last_updated: new Date().getTime(),
              }
            );
          });
        setEditing(null);
    }
  }

  useEffect(() => {
    setNickname(props.pair?.pokemon?.map((poke) => poke.nickname));
  }, [props]);

  return (
    <Tilt 
      className={styles.parallaxEffect}  
      tiltMaxAngleX={2}
      tiltMaxAngleY={2}
      tiltReverse={true}
      transitionSpeed={2500} 
      perspective={500}>
      
      <div className={styles.card}>
        <div className={styles.title}>
          <h2>Title</h2>
        </div>
       <div className={styles.sprite}>
          <div className={styles.circle}></div>
            {props.pair?.pokemon?.map(({ sprites }) => (
              <img
                src={sprites.front_default}
                alt="pokemon-sprite"
              />
            ))}
        </div>
        <div className={styles.infoGroup}>
          {props.pair?.pokemon?.map(({ name, types }, index) => (
            <div className={styles.info}>
              <h1 className={styles.nickname}>{editing === index && (
                <input
                  className={styles.editableLabel}
                  autoFocus
                  onBlur={() => setEditing(null)}
                  onKeyPress={(e) => handleLabelSubmit(e, index)}
                  onChange={(e) =>
                    setNickname(
                      nickname.map((n, i) => {
                        if (i !== index) return n;
                        return e.target.value;
                      })
                    )
                  }
                  value={nickname[index]}
                />
              )}
              {editing !== index && (
                <p onClick={() => setEditing(index)}>{nickname[index]}</p>
              )}</h1>
              <div className={styles.name}>{name}</div>
              <div className={styles.types}>
                  {types.map(({ type: { name } }) => (
                    <span className={[`${styles.typeTag}`, name].join(" ")} key={name}>
                      {name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.unlink}>
          <button onClick={() => {
            props.unlinked(props.pair.id);
          }}>
            Destroy Link
          </button>
        </div>
      </div>
    </Tilt>
  );
};

export default PokeCard;


// <CardGroup style={{ maring: 0 }}>
//       {props.pair?.pokemon?.map(({ sprites, types, name }, index) => (
//         <Card style={{ width: "12rem" }} key={index}>
//           <Card.Header className={styles.header}>
//           {editing === index && (
//                 <input
//                   autoFocus
//                   onBlur={() => setEditing(null)}
//                   onKeyPress={(e) => handleLabelSubmit(e, index)}
//                   onChange={(e) =>
//                     setNickname(
//                       nickname.map((n, i) => {
//                         if (i !== index) return n;
//                         return e.target.value;
//                       })
//                     )
//                   }
//                   value={nickname[index]}
//                 />
//               )}
//               {editing !== index && (
//                 <p onClick={() => setEditing(index)}>{nickname[index]}</p>
//               )}
//           </Card.Header>
//           <Card.Img variant="top" src={sprites.front_default} />
//           <Card.Body>
//             <Card.Title>{name}</Card.Title>
//             <Card.Text>
//               <strong>Type: </strong>
//               {types.map(({ type: { name } }) => (
//                 <span className={["type-tag", name].join(" ")} key={name}>
//                   {name}
//                 </span>
//               ))}
//             </Card.Text>
//           </Card.Body>
//         </Card>
//       ))}

//       <Button
//         className="unlink btn"
//         onClick={() => {
//           props.unlinked(props.pair.id);
//         }}
//       >
//         UnLink
//       </Button>
//     </CardGroup>