import React from 'react'
import propTypes from 'prop-types'

const Button = ( { color, text, onClick, enable} ) => {
  return <button onClick={onClick}
  style={{ backgroundColor: color}} 
  className='btn'
  disable={enable}
  >
  {text}
  </button>
}

Button.defaultProps = {
    color: 'steelblue',
    enable: 'false'
}

Button.propTypes = {
    text: propTypes.string,
    color: propTypes.string,
    onClick: propTypes.func,
}

export default Button
