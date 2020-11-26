import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import firebase from '../../Config/Firebase';
import createNewList from '../../Util/CreateNewList';
import styles from './MenuPage.module.scss';

function MenuPage() {
  const [sCode, setSCode] = useState('');
  const [err, setErr] = useState('');
  const [isLoading, setLoading] = useState(false);

  const history = useHistory();
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    let newCode = sCode.toLowerCase();
    const doesListExist = firebase.functions().httpsCallable('doesListExist');
    if (newCode.length > 0) {
      if (newCode.search(/sl-/) === 0) {
        newCode = sCode.slice(3);
      }
      doesListExist(`${newCode}`).then((result) => {
        if (!result.data) {
          setLoading(false);
          setErr('Please Check The Code');
        } else {
          setLoading(false);
          history.push(`/SL-${newCode}`);
        }
      });
    } else {
      setLoading(false);
      setErr('Please add a code');
    }
  };

  const loadSpinner = () => (<Button className={styles.joinBtn} type="submit" disabled={isLoading} onClick={handleSubmit}>{isLoading ? <span className={styles.loader}>Loading...</span> : <span>Join</span>}</Button>);

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
            <Form.Control onChange={(e) => setSCode(e.target.value)} type="text" placeholder="Enter Code Here" />
          </InputGroup>
          <Form.Label className={styles.errorLabel}>
            {err}
          </Form.Label>
          {loadSpinner()}
          <Button className={styles.createBtn} disabled={isLoading} type="button" onClick={() => createNewList()}>Create</Button>
        </Form>
      </div>
    </div>
  );
}

export default MenuPage;
