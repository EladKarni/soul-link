import React, { useState } from 'react'
import { Button, Form } from "react-bootstrap";
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
                    <Form.Group controlId="slcode">
                        <Form.Label>Soul-Link Code</Form.Label>
                        <Form.Control value={sCode} onChange={(e) => setSCode(e.target.value)} type="text" placeholder="SL-423f2gf7" />
                        <span>{err}</span>
                    </Form.Group>

                    <Button onClick={handleClick}>Join</Button>
                </Form>
            </div>
        </div>
    )
}

export default MenuPage
