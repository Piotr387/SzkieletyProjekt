// import {FaTimes} from 'react-icons/fa'
import Button from './Button'
import { CONSTANTS } from './Constants';



const Lecture = ({ lecture, onClick, listType }) => {

  const typeOfLecutreList = () => {
    switch (listType) {
      case CONSTANTS.UNREGISTERED_LIST:
        return NormalForm();
      case CONSTANTS.USER_LECTURE_LIST:
        return UserLecture()
      case CONSTANTS.ORGANIZER_LECTURE_LIST:
        return OrganizerLectures()
      default:
        return 'No form choosen';
    }
  }

  function NormalForm() {
    return <div className="lecture">
      <h3>Nazwa wydarzenia: {lecture.lectureDTO.name}
        {lecture.takenSeats < lecture.capacity ?
          <Button color='green' text='Zapisz się' onClick={() => onClick(lecture.lectureDTO.name)} /> :
          <Button color='gray' text='Brak miejsc' enable={'true'} />}
      </h3>
      <p>Tematyka: {lecture.lectureDTO.thematicPath}</p>
      <p>Czas rozpoczęcia: {lecture.lectureDTO.startTime}</p>
      <p>Ilość miejsc: {lecture.takenSeats}/{lecture.capacity}</p>
    </div>
  }

  function UserLecture() {
    return <div className="lecture">
      <h3>Nazwa wydarzenia: {lecture.name}
          <Button color='red' text='Zrezygnuj' onClick={() => onClick(lecture.name)} />
      </h3>
      <p>Tematyka: {lecture.thematicPath}</p>
      <p>Czas rozpoczęcia: {lecture.startTime}</p>
    </div>
  }

  function OrganizerLectures(){
    return <div className="lecture">
      <h3>Nazwa wydarzenia: {lecture.name}
          <Button color='green' text='Szczegoly' onClick={() => onClick(lecture.name)} />
      </h3>
      <p>Tematyka: {lecture.thematicPath}</p>
      <p>Czas rozpoczęcia: {lecture.startTime}</p>
    </div>
  }

  return (
    typeOfLecutreList()
  )
}

Lecture.defaultProps = {
  listType: CONSTANTS.UNREGISTERED_LIST
}

export default Lecture