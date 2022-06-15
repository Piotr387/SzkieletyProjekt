import React, { useEffect, useState } from 'react'
import { CONSTANTS } from './Constants';
import { getJwtToken } from "./tokenService"
import LectureList from './LectureList';
import toastEvent from './Toast'

const UserLectures = () => {
    const [lectures, setLectures] = useState([])

    useEffect(() => {
        const getLectures = async () => {
            const lecturesFromServer = await fetchLectures()
            setLectures(lecturesFromServer)
        }
        getLectures()
    })

    //Fetch lectures from server
    const fetchLectures = async () => {
        const access_token = await getJwtToken()
        const res = await fetch(CONSTANTS.ENDPOINT_USER_LECTURES, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            }
        })
        const data = await res.json()
        return data
    }

    const cancelReservation = async (lectureName) => {
        const access_token = await getJwtToken()
        const res = await fetch(CONSTANTS.ENDPOINT_CANCEL_USER_RESERVATION, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
            body: new URLSearchParams({
                lectureName
            })
        })
        const jsonBody = await res.json()
        toastEvent({ 'res': { res }, 'resJson': jsonBody })
        return jsonBody
    }

    return (
        <div>
            <h1>User's lectures</h1>
            {lectures.length > 0 ? <LectureList onClick={cancelReservation} listType={CONSTANTS.USER_LECTURE_LIST} lectures={lectures} /> : CONSTANTS.ERROR_LOADING_USER_LECTURES}
        </div>
    )
}

export default UserLectures
