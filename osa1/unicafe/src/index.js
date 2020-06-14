import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const StatisticLine = props => {
  const { name, value } = props

  return <tr>
    <td>{name}</td>
    <td>{value}</td>
  </tr>
}

const Statistics = (props) => {
  const { good, neutral, bad } = props
  const all = good + neutral + bad
  const avg = (good - bad) / all
  const pos = good / all * 100 + ' %'

  const rows = [
    <StatisticLine name='good' value={good} key='good' />,
    <StatisticLine name='neutral' value={neutral} key='neutral' />,
    <StatisticLine name='bad' value={bad} key='bad' />
  ]

  if (all > 0) {
    rows.push(<StatisticLine name='all' value={all} key='all' />)
    rows.push(<StatisticLine name='average' value={avg} key='avg' />)
    rows.push(<StatisticLine name='positive' value={pos} key='pos' />)
  }

  return <div>
    <h1>Statistics</h1>
    <table>
      <tbody>
        {rows}
      </tbody>
    </table>
  </div>
}

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>
    {text}
  </button>
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={increaseGood} text='good' />
      <Button handleClick={increaseNeutral} text='neutral' />
      <Button handleClick={increaseBad} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)
