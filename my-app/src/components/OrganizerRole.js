import React, { useEffect, useState } from 'react'
import { CONSTANTS } from './Constants';
import LectureList from './LectureList';
import { getJwtToken } from "./tokenService"
import ModalElement from './ModalElement';

const OrganizerRole = () => {

    const [lectures, setLectures] = useState([])


    const [show, setShow] = useState(false);
    const [modalType, setModalType] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [arrayOfUsers, setArrayOfUsers] = useState([])
 
    const userDetails = async (name) => {
        const getUsers = lectures.filter( element => element.name === name).map(el => el.users)[0]
        setArrayOfUsers(getUsers)
        setModalType(CONSTANTS.MODAL_TYPE_USER_LIST)
        setModalTitle(CONSTANTS.MODAL_TITLE_USER_LIST)
        showModal()
    }

    useEffect(() => {
        const getLectures = async () => {
            const lecturesFromServer = await fetchLectures()
            setLectures(lecturesFromServer)
        }
        getLectures()
    }, [arrayOfUsers])

    //Fetch users from server
    const fetchLectures = async () => {
        const access_token = getJwtToken()
        const res = await fetch('users/organizer', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            }
        })
        const data = await res.json()
        return data
    }

    const showModal = () => {
        setShow(true)
      }

    return (
        <div>
            <h1>Hello organizer</h1>
            <hr></hr>
            <h3>Lecture list:</h3>
            {lectures.length > 0 ? <LectureList lectures={lectures} onClick={userDetails} listType={CONSTANTS.ORGANIZER_LECTURE_LIST} /> : "Error loading lectures"}
            <ModalElement modalType={modalType} show={show} setShow={setShow} title={modalTitle} listOfUsers={arrayOfUsers}/>
        </div>
    )
}

export default OrganizerRole