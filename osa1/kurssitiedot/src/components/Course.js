import React from 'react'


const Course = ({ course }) => {
    return <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
}

const Header = (props) => {
    const course = props.course
  
    return (
      <h1>{course}</h1>
    )
  }
  
  const Content = ({ parts }) => {
  
    return (
      <div> {
        parts.map(part => (
          <Part key={part.name} part={part.name} exercise={part.exercises} />
        ))
      }
      </div>
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

export default Course