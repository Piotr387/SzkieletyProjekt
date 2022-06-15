import LectureList from "../components/LectureList";
import { CONSTANTS } from "./Constants";
import React, { useEffect, useState } from 'react'
import { getJwtToken } from "./tokenService"
import toastEvent from './Toast'



const UserOtherList = () => {
    const [lectures, setLectures] = useState([])

    useEffect(() => {
        const getLectures = async () => {
            const lecturesFromServer = await fetchLectures()
            setLectures(lecturesFromServer)
        }
        getLectures()
    })

    const fetchLectures = async () => {
        const access_token = await getJwtToken()
        const resUser = await fetch(CONSTANTS.ENDPOINT_USER_LECTURES, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            }
        })
        const dataUser = await resUser.json()

        const resAll = await fetch(CONSTANTS.ENDPOINT_LECTURE_DETAILS)
        const dataAll = await resAll.json()

        let userTime = dataUser.map(a => a.startTime)

        const dataAllFiltered = dataAll.filter( element => {
            return !userTime.includes(element.lectureDTO.startTime)
        })
        
        return dataAllFiltered
    }

    const signIn = async (lectureName) => {
        const access_token = await getJwtToken()
        const res = await fetch('users/sign-up-register', {
            method: 'POST',
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
        <>
        <h3>Lista dotępnych wykładów na ktore mozesz sie zapisać</h3>
        <LectureList lectures={lectures} onClick={signIn}/>
        </>
        
    )
}

export default UserOtherList
