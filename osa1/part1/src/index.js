import React from 'react'
import ReactDOM from 'react-dom'

const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}</p>
    </div>
  )
}

const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Joonas"/>
  </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
