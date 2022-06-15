import React, { useEffect, useState } from 'react'
import { CONSTANTS } from './Constants';
import { getJwtToken } from "./tokenService"
import LectureList from './LectureList';
import toastEvent from './Toast'

const UserAccountDetails = () => {
    const [accountDetails, setAccountDetails] = useState([])

    useEffect(() => {
        const getaccountDetails = async () => {
            const accountDetailsFromServer = await fetchAccountDetails()
            setAccountDetails(accountDetailsFromServer)
        }
        getaccountDetails()
    })

    const fetchAccountDetails = async () => {
        const access_token = await getJwtToken()
        const res = await fetch(CONSTANTS.ENDPOINT_USER_ACCOUNT_DETAILS, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            }
        })
        const data = await res.json()
        return data
    }

    return (
        <>
            <h1>Dane szczegółowe konta:</h1>
            <p>Login: {accountDetails.login}</p>
            <p>Email: {accountDetails.email}</p>
        </>
    )
}

export default UserAccountDetails
