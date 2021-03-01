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

const person = new Person({
  name: args[3],
  number: args[4]
})

console.log('person', person)

person
  .save()
  .then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })