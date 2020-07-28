import React from 'react'

const Notification = (props) => {
  const { message, type } = props

  if (!message || !type) {
    return null
  }

  return <div className={type + ' notification'} >
    {message}
  </div>
}

export default Notification