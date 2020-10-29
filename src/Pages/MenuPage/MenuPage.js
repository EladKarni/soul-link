import React, { useState } from 'react'
import { Button, Form, InputGroup } from "react-bootstrap";
import { useHistory } from 'react-router-dom';

import styles from './MenuPage.module.scss';

function MenuPage() {
    const [sCode, setSCode] = useState('')
    const [err, setErr] = useState('')

    const history = useHistory();
    const handleClick = () => sCode.length > 0 ? history.push(`/SL-${sCode}`) : setErr("Please Add A Code")

    return (
        <div className={styles.menuPage}>
            <div className={styles.actionArea}>
                <Form className={styles.form}>
                    <Form.Label>Soul-Link Code</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon3">
                            {`SL-`}
                        </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>
                    <Button onClick={handleClick}>Join</Button>
                </Form>
            </div>
        </div>
    )
}

export default MenuPage
