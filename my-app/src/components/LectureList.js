import React from 'react'
import { CONSTANTS } from './Constants'
import Lecture from './Lecture'

const LectureList = ( {lectures, onClick, listType}) => {
  return (
    <>
      {lectures.map( (lecture) => (<Lecture listType={listType} lecture={lecture} onClick={onClick}/>))}
    </>
  )
}

LectureList.defaultProps = {
  listType : CONSTANTS.UNREGISTERED_LIST
}

export default LectureList
