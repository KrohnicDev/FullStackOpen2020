const mongoose = require('mongoose')
const args = process.argv

if (args.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = args[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0.cvvga.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const schema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', schema)

if (args.length === 5) {
  const name = args[3]
  const number = args[4]
  const person = new Person({ name, number })

  person
    .save()
    .then(() => {
      console.log(`Added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })

} else if (args.length === 3) {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(p => console.log(`${p.name} ${p.number}`))
      mongoose.connection.close()
    })
}

