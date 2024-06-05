// Editable.js
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import styles from './Editable.module.scss';

const Editable = ({
  text,
  type,
  cssStyle,
  changeText,
  listCode,
  cardID,
  syncFunc,
  index,
  dead,
  ...props
}) => {
  const [isEditing, setEditing] = useState(false);
  const inputEl = useRef(null);

  const onLabelClicked = () => {
    if (!dead) {
      setEditing(true);
    }
  };

  useEffect(() => {
    if (isEditing) inputEl.current.focus();
  }, [isEditing]);

  return (
    <section {...props}>
      {isEditing ? (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <div
          role="textbox"
          tabIndex={0}
          onBlur={() => setEditing(false)}
          className={cssStyle}
        >
          <input
            ref={inputEl}
            type="text"
            name="title"
            value={text}
            onBlur={(e) => {
              syncFunc(e, text, index);
            }}
            onChange={(e) => changeText(e.target.value, index)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                e.target.blur();
              }
            }}
          />
        </div>
      ) : (
        <div
          role="textbox"
          aria-hidden="true"
          className={dead ? styles.disabledLabel : styles.label}
          onClick={onLabelClicked}
        >
          <span>{text}</span>
        </div>
      )}
    </section>
  );
};

Editable.defaultProps = {
  index: 0,
  text: 'Edit Me!',
  dead: false,
};

Editable.propTypes = {
  text: PropTypes.string,
  dead: PropTypes.bool,
  type: PropTypes.string.isRequired,
  cssStyle: PropTypes.string.isRequired,
  changeText: PropTypes.func.isRequired,
  listCode: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  syncFunc: PropTypes.func.isRequired,
  index: PropTypes.number,
};

export default Editable;
