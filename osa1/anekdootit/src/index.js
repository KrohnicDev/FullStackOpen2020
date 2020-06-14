import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {

  const initialAnecdotes = props.anecdotes.map(anecdote => {
    return {
      text: anecdote,
      votes: 0
    }
  })

  const [selected, setSelected] = useState(0)
  const [anecdotes, setAnecdotes] = useState(initialAnecdotes)

  const handleNextAnecdoteClick = () => {
    let randomIndex = null

    do {
      randomIndex = randomIntFromInterval(0, initialAnecdotes.length - 1)
    } while (randomIndex === selected)

    setSelected(randomIndex)
  }

  const handleVoteClick = () => {
    const items = [...anecdotes]
    items[selected].votes += 1
    setAnecdotes(items)
  }

  const currentAnecdote = anecdotes[selected]
  const highestVoted = anecdotes.reduce((max, current) =>
    current.votes > max.votes ? current : max
  )

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <Anecdote anecdote={currentAnecdote} />
      <button onClick={handleVoteClick}>Vote</button>
      <button onClick={handleNextAnecdoteClick}>Next anecdote</button>
      <h2>Highest voted anecdote</h2>
      <Anecdote anecdote={highestVoted} />
    </div>
  )
}

const Anecdote = ({ anecdote }) => {
  return <p>{anecdote.text} ({anecdote.votes} votes)</p>
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}