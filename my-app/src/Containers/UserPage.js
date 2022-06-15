import React, { useEffect, useState } from 'react'

import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import toastEvent from '../components/Toast';
import { getNewAccessToken, getJwtToken } from '../components/tokenService';
import jwt from 'jwt-decode'
import UserRole from '../components/UserRole'
import OrganizerRole from '../components/OrganizerRole';
// import jwtDecode from 'jwt-decode';
import Header from "../components/Header";
import { CONSTANTS } from '../components/Constants';


const UserPage = () => {

  const [userRole, setUserRole] = useState(false)
  const [organizerRole, setOrganizerRole] = useState(false)

  const navigate = useNavigate()

  const signOut = () => {
    setUserRole(false)
    setOrganizerRole(false)
    navigate('/', { replace: true })
    toastEvent({ 'res': 'Sign out' })
  }

  useEffect(() => {
    const access_token = getJwtToken()
    const decode = jwt(access_token)
    if (decode.exp < Date.now() / 1000) {
      getNewAccessToken()
      const access_token = getJwtToken()
      const decode = jwt(access_token)
      if (decode.exp < Date.now() / 1000){
        navigate('/', {replace: true})
      }
    }
    if (decode.roles) {
      const roles = decode.roles
      if (roles instanceof Array) {
        if (roles.includes('ROLE_ORGANIZER')) {
          setOrganizerRole(true)
        }
        if (roles.includes('ROLE_USER')) {
          setUserRole(true)
        }
      }
    }
  }, [])

  return (
    <div className="container">
      <Header modal={signOut} tittle={CONSTANTS.HEADER_TITLE_USER_CONTROL_PANEL} />
      {userRole === true ? <UserRole signOut={signOut}/>:<></>}
      {organizerRole === true ? <OrganizerRole/> :<></>}
    
    </div>
  )
}

export default UserPage
