import React from 'react'
import SignUpForLecture from "./SignUpForLecture";
import SignIn from "./SignIn"
import UserList from "./UserList"
import { Modal, Button } from "react-bootstrap";
import { CONSTANTS } from './Constants';


const ModalElement = ({ modalType, show, setShow, title, listOfUsers }) => {

  const hideModal = () => {
    setShow(false)
  };

  const typeOfModal = () => {
    switch (modalType) {
      case CONSTANTS.MODAL_TYPE_SIGN_IN:
        return <SignIn hideModal={hideModal} />;
      case CONSTANTS.MODAL_TYPE_SIGN_UP_FOR_LECTURE:
        return <SignUpForLecture pickedLecture={title} hideModal={hideModal} />;
      case CONSTANTS.MODAL_TYPE_USER_LIST:
        return <UserList listOfUsers={listOfUsers}/>
      default:
        return 'No form choosen';
    }
  }
  return (
    <>
      <Modal show={show} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {typeOfModal()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}

export default ModalElement
