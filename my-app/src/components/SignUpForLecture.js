import React, { useState } from 'react'
import toastEvent from './Toast'

const SignUpForLecture = ( { pickedLecture, hideModal }) => {
    const [lectureName] = useState(pickedLecture)
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')

    const emailRFC5322Standard = new RegExp("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")

    const signUp = async (lecutureSignUp) => {
      const res = await fetch('users/sign-up', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(lecutureSignUp)
      });
      const jsonBody = await res.json()
      toastEvent({'res':{res}, 'resJson':jsonBody})
      hideModal()
    }

    const onSubmit = (e) => {
      e.preventDefault()
      if (!login){
        toastEvent({'res':'SignUpForLecture', 'resJson':'Pls add login.'})
        return  
      }
      if(password !== checkPassword){
        toastEvent({'res':'SignUpForLecture', 'resJson':'Password not match to each other.'})
        return 
      }
      if(!email){
        toastEvent({'res':'SignUpForLecture', 'resJson':'Pls add email'})
        return 
      }

      if(!emailRFC5322Standard.test(email)){
        toastEvent({'res':'SignUpForLecture', 'resJson':'Email don\'t match RFC 5322 Standard'})
        return 
      }
      
      const userDTO = { login, email, password}

      signUp( {lectureName, userDTO} )

      setLogin('')
      setEmail('')
      setPassword('')
      setCheckPassword('')

    }

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control-custom'>
          <label>Login:</label>
          <input type='text' 
          placeholder='Wpisz login...' 
          value={login} 
          onChange={ (e) => setLogin(e.target.value)}
          />
      </div>
      <div className='form-control-custom'>
          <label>Hasło:</label>
          <input type='password' 
          placeholder='Wpisz hasło...'
          value={password} 
          onChange={ (e) => setPassword(e.target.value)}
          />
      </div>
      <div className='form-control-custom'>
          <label>Powtórz hasło:</label>
          <input type='password' 
          placeholder='Powtórz hasło hasło...'
          value={checkPassword} 
          onChange={ (e) => setCheckPassword(e.target.value)}
          />
      </div>
      <div className='form-control-custom'>
          <label>Email:</label>
          <input type='text' 
          placeholder='Wpisz email...'
          value={email} 
          onChange={ (e) => setEmail(e.target.value)}
          />
      </div>
      <input type='submit' value='Save task' className='btn btn-block'/>
    </form>
  )
}

export default SignUpForLecture
