import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
  )
}

const Header = (props) => {
  const course = props.course

  return (
    <h1>{course}</h1>
  )
}

const Content = (props) => {
  const items = props.parts.map(part => (
      <Part key={part.name} part={part.name} exercise={part.exercises}/>
    )
  )

  return (
    <div> {items} </div>
  )
}

const Part = (props) => (
  <p>
    {props.part} {props.exercise}
  </p>
)

const Total = (props) => {
    const total = props.parts
    .map(part => part.exercises)
    .reduce((prev, current) => prev + current)

  return (
    <p>Number of exercises {total}</p>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))