import React from 'react'
import Header from "../components/Header";
import LectureList from "../components/LectureList";
import ModalElement from '../components/ModalElement';
import { CONSTANTS } from '../components/Constants';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';


const MainPage = () => {
  const [lectures, setLectures] = useState([])
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState('')
  const [modalTitle, setModalTitle] = useState('')

  const showModal = () => {
    setShow(true)
  }

  //SignIn to user account
  const signIn = () => {
    setModalType(CONSTANTS.MODAL_TYPE_SIGN_IN)
    setModalTitle(CONSTANTS.MODAL_TITLE_SIGN_IN_FORM)
    showModal()
  }

  //Sign up for lecture
  const signUpForLecture = (name) => {
    setModalType(CONSTANTS.MODAL_TYPE_SIGN_UP_FOR_LECTURE)
    setModalTitle(name)
    showModal()
  }

  useEffect(() => {
    const getLectures = async () => {
      const lecturesFromServer = await fetchLectures()
      setLectures(lecturesFromServer)
    }
    getLectures()
  })

  //Fetch lectures from server
  const fetchLectures = async () => {
    const res = await fetch(CONSTANTS.ENDPOINT_LECTURE_DETAILS)
    const data = await res.json()
    return data
  }

  return (
    <div className="container">
      <Header modal={signIn} />
      {lectures.length > 0 ? <LectureList lectures={lectures} onClick={signUpForLecture} /> : CONSTANTS.ERROR_LOADING_LECTURES}
      <ModalElement modalType={modalType} show={show} setShow={setShow} title={modalTitle} />
    </div>
  )
}

export default MainPage
