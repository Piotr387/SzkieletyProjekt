import React, { useState } from 'react';
import toastEvent from './Toast';
import { setJwtToken, setRefreshToken } from './tokenService';
import { useNavigate } from 'react-router-dom';
import { getJwtToken } from "./tokenService"

const UserUpdateEmail = () => {

    const [newEmail, setNewEmail] = useState('')

    const emailRFC5322Standard = new RegExp("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")

    const sendRequest = async () => {
        const access_token = await getJwtToken()
        const res = await fetch('users/update-email', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
            body: new URLSearchParams({
                newEmail
            })
        });

        const jsonBody = await res.json()
        toastEvent({ 'res': { res }, 'resJson': jsonBody })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!newEmail) {
            alert('Pls fill the email')
            return
        }

        sendRequest()

        setNewEmail('')

    }

    return (
        <>
            <h1>Aktualizuj email:</h1>
            <form className='add-form' onSubmit={onSubmit}>
                <div className='form-control-custom'>
                    <label>Email:</label>
                    <input type='text'
                        placeholder='Wpisz Email...'
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </div>
                <input type='submit' value='Sign in' className='btn btn-block' />
            </form>
        </>

    )
}

export default UserUpdateEmail
