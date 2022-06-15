import React, { useState } from 'react';
import toastEvent from './Toast';
import { setJwtToken, setRefreshToken } from './tokenService';
import {useNavigate} from 'react-router-dom';

const SignIn = ({ hideModal }) => {

    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const sendRequest = async () => {
        const res = await fetch('users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: new URLSearchParams({
                login, password
            })
        });
        if (res.status === 200) {
            const jsonBody = await res.json()
            if (res.status === 200) {
                setJwtToken(jsonBody.access_token)
                setRefreshToken(jsonBody.refresh_token)
            }
            toastEvent({ 'res': { res }, 'resJson': jsonBody })
            hideModal()
            navigate('/user', {replace: true})
        }
        const jsonBody = await res.json()
        toastEvent({ 'res': { res }, 'resJson': jsonBody })
        hideModal()
        
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!login) {
            toastEvent({'res':'SignUpForLecture', 'resJson':'Pls add login.'})
            return
        }
        if (!password) {
            toastEvent({'res':'SignUpForLecture', 'resJson':'Pls add password.'})
            return
        }

        sendRequest()

        setLogin('')
        setPassword('')

    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control-custom'>
                <label>Login:</label>
                <input type='text'
                    placeholder='Wpisz login...'
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
            </div>
            <div className='form-control-custom'>
                <label>Password:</label>
                <input type='password'
                    placeholder='Wpisz hasło...'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <input type='submit' value='Sign in' className='btn btn-block' />
        </form>
    )
}

export default SignIn
