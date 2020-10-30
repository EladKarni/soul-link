import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import styles from './MenuPage.module.scss';

function MenuPage() {
  const [sCode, setSCode] = useState('');
  const [err, setErr] = useState('');

  const history = useHistory();
  const handleClick = () => (sCode.length > 0 ? history.push(`/SL-${sCode}`) : setErr('Please add a code'));

  return (
    <div className={styles.menuPage}>
      <div className={styles.actionArea}>
        <Form className={styles.form}>
          <Form.Label>Soul-Link Code</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">
                SL-
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control onChange={(e) => setSCode(e.target.value)} type="text" placeholder="423f2gf7" />
          </InputGroup>
          <Form.Label className={styles.errorLabel}>
            {err}
          </Form.Label>
          <Button onClick={handleClick}>Join</Button>
        </Form>
      </div>
    </div>
  );
}

export default MenuPage;
