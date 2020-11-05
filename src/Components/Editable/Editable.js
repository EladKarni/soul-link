// Editable.js
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Editable = ({
  text,
  type,
  cssStyle,
  changeText,
  listCode,
  cardID,
  syncFunc,
  index,
  ...props
}) => {
  const [isEditing, setEditing] = useState(false);
  const inputEl = useRef(null);

  const onLabelClicked = () => {
    setEditing(true);
  };

  useEffect(() => {
    if (isEditing) inputEl.current.focus();
  }, [isEditing]);

  return (
    <section {...props}>
      {isEditing ? (
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
          onClick={onLabelClicked}
        >
          <span>
            {text || 'Editable content'}
          </span>
        </div>
      )}
    </section>
  );
};

Editable.defaultProps = {
  index: 0,
};

Editable.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  cssStyle: PropTypes.string.isRequired,
  changeText: PropTypes.func.isRequired,
  listCode: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  syncFunc: PropTypes.func.isRequired,
  index: PropTypes.number,
};

export default Editable;
