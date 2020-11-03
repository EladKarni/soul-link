import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';
import styles from './MenuPage.module.scss';

function MenuPage() {
  const [sCode, setSCode] = useState('');
  const [err, setErr] = useState('');

  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (sCode.length > 0) {
      if (sCode.toLowerCase().search(/sl-/) === 0) {
        history.push(`/SL-${sCode.slice(3)}`);
      } else {
        history.push(`/SL-${sCode}`);
      }
    } else {
      setErr('Please add a code');
    }
  };
  const handleCreate = () => {
    const generateCode = firebase.functions().httpsCallable('generateCode');
    generateCode().then((result) => {
      console.log(result);
    });
  };

  return (
    <div className={styles.menuPage}>
      <div className={styles.actionArea}>
        <Form className={styles.form} onSubmit={handleSubmit}>
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
          <Button type="submit" onClick={handleSubmit}>Join</Button>
          <Button type="button" onClick={handleCreate}>Join</Button>
        </Form>
      </div>
    </div>
  );
}

export default MenuPage;
