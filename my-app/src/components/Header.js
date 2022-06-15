import propTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import Button from './Button'
import { CONSTANTS } from './Constants'


const Header = ({ modal, tittle}) => {

    const onCLick = () => {
      modal()
    }

    const location = useLocation()

  return (
    
    <div className='header'>
      <h1>{tittle}</h1>
      { location.pathname === '/' ?
        <Button color='green' text={CONSTANTS.BUTTON_SIGN_IN} onClick={onCLick}></Button> :
        <Button color='red' text={CONSTANTS.BUTTON_SIGN_OUT} onClick={onCLick}></Button>
      }
      
    </div>
  )
}

Header.defaultProps = {
    tittle: 'Lectures Manager',
}

Header.propTypes = {
    title: propTypes.string,
}

export default Header
